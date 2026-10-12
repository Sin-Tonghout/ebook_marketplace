const env = require('../config/env');

// Local: same-site (localhost ports), so "lax" works.
// Production: the frontend (vercel.app) and API (onrender.com) are different
// sites, so the cookie must be SameSite=None + Secure.
const base = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  path: '/',
};

function setSessionCookie(res, token, expiresAt) {
  res.cookie(env.cookieName, token, { ...base, expires: expiresAt });
}

function clearSessionCookie(res) {
  res.clearCookie(env.cookieName, base);
}

module.exports = { setSessionCookie, clearSessionCookie };