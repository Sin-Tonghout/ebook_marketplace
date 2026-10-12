const env = require('../config/env');
const authService = require('../services/auth.service');
const { ok } = require('../utils/response');
const { setSessionCookie, clearSessionCookie } = require('../utils/cookies');

exports.register = async (req, res) => {
  const { user, token, expiresAt } = await authService.register(req.body, req);
  setSessionCookie(res, token, expiresAt);
  ok(res, { user }, 201);
};

exports.login = async (req, res) => {
  const { user, token, expiresAt } = await authService.login(req.body, req);
  setSessionCookie(res, token, expiresAt);
  ok(res, { user });
};

exports.logout = async (req, res) => {
  await authService.logout(req.cookies?.[env.cookieName]);
  clearSessionCookie(res);
  ok(res, {});
};

// Guests get 200 with user: null, so the frontend can ask without errors.
exports.me = async (req, res) => {
  const token = req.cookies?.[env.cookieName];
  const found = token ? await authService.getUserFromToken(token) : null;
  if (token && !found) clearSessionCookie(res);
  ok(res, { user: found ? authService.toSessionUser(found) : null });
};

exports.forgotPassword = async (req, res) => {
  await authService.requestPasswordReset(req.body.email);
  ok(res, {});
};

exports.resetPassword = async (req, res) => {
  await authService.resetPassword(req.body);
  ok(res, {});
};

exports.updateProfile = async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  ok(res, { user });
};

exports.becomeSeller = async (req, res) => {
  const { profile, rightsConfirmed } = req.body;
  const user = await authService.becomeSeller(req.user.id, profile, rightsConfirmed);
  ok(res, { user });
};