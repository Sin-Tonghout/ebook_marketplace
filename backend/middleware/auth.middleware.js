const env = require('../config/env');
const authService = require('../services/auth.service');
const { AppError } = require('../utils/response');
const { clearSessionCookie } = require('../utils/cookies');

// Express 5 forwards rejected promises from async middleware to the error handler.
async function requireAuth(req, res, next) {
  const token = req.cookies?.[env.cookieName];
  const user = token ? await authService.getUserFromToken(token) : null;

  if (!user) {
    if (token) clearSessionCookie(res);
    throw new AppError(401, 'UNAUTHENTICATED', 'Please sign in again.');
  }

  req.user = user; // raw Prisma user (with author + favoriteCategories)
  next();
}

// For write actions that suspended accounts must not perform.
function requireActive(req, res, next) {
  if (req.user.status === 'suspended') {
    throw new AppError(403, 'ACCOUNT_SUSPENDED', 'Your account is suspended.');
  }
  next();
}

module.exports = { requireAuth, requireActive };