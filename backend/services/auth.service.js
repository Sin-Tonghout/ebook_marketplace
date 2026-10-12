const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const env = require('../config/env');
const { AppError } = require('../utils/response');

const BCRYPT_ROUNDS = 12;
// Used to keep login timing the same when the email does not exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_ROUNDS);

const userInclude = {
  author: true,
  favoriteCategories: { include: { category: true } },
};

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// Converts a Prisma user into the SessionUser shape the frontend already uses.
function toSessionUser(u) {
  const out = {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    favoriteCategories: (u.favoriteCategories || []).map((f) => f.category.name),
  };
  if (u.avatarUrl) out.avatarUrl = u.avatarUrl;
  if (u.bio) out.bio = u.bio;
  if (u.author) {
    out.sellerProfile = {
      displayName: u.author.displayName,
      bio: u.author.bio || '',
      ...(u.author.websiteUrl ? { websiteUrl: u.author.websiteUrl } : {}),
    };
  }
  return out;
}

const fetchUser = (id) =>
  prisma.user.findUnique({ where: { id }, include: userInclude });

async function createSession(userId, req) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + env.sessionDays * 24 * 60 * 60 * 1000);
  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      userAgent: (req.get('user-agent') || '').slice(0, 255) || null,
      ip: req.ip ? String(req.ip).slice(0, 64) : null,
      expiresAt,
    },
  });
  return { token, expiresAt };
}

async function register({ name, email, password }, req) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new AppError(409, 'EMAIL_TAKEN', 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  let created;
  try {
    created = await prisma.user.create({
      data: { name, email, passwordHash },
    });
  } catch (err) {
    // Two requests with the same email at the same moment.
    if (err.code === 'P2002') {
      throw new AppError(409, 'EMAIL_TAKEN', 'An account with this email already exists.');
    }
    throw err;
  }

  const session = await createSession(created.id, req);
  const user = toSessionUser(await fetchUser(created.id));
  return { user, ...session };
}

async function login({ email, password }, req) {
  const found = await prisma.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, found ? found.passwordHash : DUMMY_HASH);

  if (!found || !valid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  }

  // Housekeeping: drop this user's expired sessions.
  await prisma.authSession.deleteMany({
    where: { userId: found.id, expiresAt: { lt: new Date() } },
  });

  // Suspended users may sign in (the UI shows the suspended state).
  const session = await createSession(found.id, req);
  const user = toSessionUser(await fetchUser(found.id));
  return { user, ...session };
}

async function logout(token) {
  if (!token) return;
  await prisma.authSession.deleteMany({ where: { tokenHash: hashToken(token) } });
}

// Returns the raw Prisma user (with relations) or null.
async function getUserFromToken(token) {
  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: userInclude } },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.authSession.delete({ where: { id: session.id } });
    return null;
  }
  return session.user;
}

// Always resolves, so attackers can't probe which emails exist.
async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, usedAt: null },
  });

  const token = crypto.randomBytes(32).toString('hex');
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  // Real email delivery comes later. For now, the link is printed in the API
  // console (development only). Adjust the path to match your reset page.
  if (!env.isProd) {
    console.log(`[password reset] ${env.frontendUrl}/reset-password?token=${token}`);
  }
}

async function resetPassword({ token, password }) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw new AppError(400, 'TOKEN_EXPIRED', 'This reset link has expired.');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    // Sign the user out everywhere after a password change.
    prisma.authSession.deleteMany({ where: { userId: record.userId } }),
  ]);
}

async function updateProfile(userId, patch) {
  await prisma.$transaction(async (tx) => {
    const data = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.bio !== undefined) data.bio = patch.bio;
    if (Object.keys(data).length) {
      await tx.user.update({ where: { id: userId }, data });
    }

    if (patch.favoriteCategories) {
      // Names that don't exist as categories yet are skipped.
      const cats = await tx.category.findMany({
        where: { name: { in: patch.favoriteCategories } },
        select: { id: true },
      });
      await tx.userFavoriteCategory.deleteMany({ where: { userId } });
      if (cats.length) {
        await tx.userFavoriteCategory.createMany({
          data: cats.map((c) => ({ userId, categoryId: c.id })),
        });
      }
    }
  });

  return toSessionUser(await fetchUser(userId));
}

async function becomeSeller(userId, profile, rightsConfirmed) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user.status === 'suspended') {
    throw new AppError(403, 'SUSPENDED', "Suspended accounts can't become sellers.");
  }
  if (!rightsConfirmed) {
    throw new AppError(400, 'RIGHTS_REQUIRED', 'You need to confirm your publishing rights.');
  }

  const role = user.role === 'user' ? 'seller' : user.role; // never downgrade admins
  const fields = {
    displayName: profile.displayName,
    bio: profile.bio || '',
    websiteUrl: profile.websiteUrl || null,
    rightsConfirmedAt: new Date(),
  };

  await prisma.$transaction([
    prisma.author.upsert({
      where: { userId },
      update: fields,
      create: { userId, ...fields },
    }),
    prisma.user.update({ where: { id: userId }, data: { role } }),
  ]);

  return toSessionUser(await fetchUser(userId));
}

module.exports = {
  toSessionUser,
  register,
  login,
  logout,
  getUserFromToken,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  becomeSeller,
};