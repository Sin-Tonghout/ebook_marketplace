const { ZodError } = require('zod');
const { AppError } = require('../utils/response');

// Four arguments are required for Express to treat this as an error handler.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    const errors = err.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return res.status(400).json({
      success: false,
      message: errors[0]?.message || 'Invalid input.',
      code: 'VALIDATION_ERROR',
      errors,
    });
  }

  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ success: false, message: err.message, code: err.code });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body.',
      code: 'INVALID_JSON',
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again.',
    code: 'INTERNAL_ERROR',
  });
}

module.exports = { errorHandler };