const prisma = require('../config/db');
const { AppError } = require('../utils/response');

// Database row -> the SellerPublicProfile shape the frontend uses.
const toProfile = (a) => ({
  displayName: a.displayName,
  bio: a.bio ?? '',
  website: a.websiteUrl ?? '',
  instagram: a.instagram ?? '',
  x: a.x ?? '',
});

// Returns null when the user has no seller profile yet.
async function getProfile(userId) {
  const author = await prisma.author.findUnique({ where: { userId } });
  return author ? toProfile(author) : null;
}

async function saveProfile(userId, input) {
  const author = await prisma.author.findUnique({ where: { userId } });
  if (!author) {
    throw new AppError(403, 'NOT_A_SELLER', 'Create a seller profile first.');
  }

  const updated = await prisma.author.update({
    where: { userId },
    data: {
      displayName: input.displayName,
      bio: input.bio || null,
      websiteUrl: input.website || null,
      instagram: input.instagram || null,
      x: input.x || null,
    },
  });
  return toProfile(updated);
}

module.exports = { getProfile, saveProfile };