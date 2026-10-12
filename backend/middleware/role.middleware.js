const { AppError } = require('../utils/response');

// Usage: router.get('/admin/users', requireAuth, requireRole('admin', 'super_admin'), ...)
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'FORBIDDEN', "You don't have access to this.");
    }
    next();
  };

module.exports = { requireRole };