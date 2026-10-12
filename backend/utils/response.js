// Throw this anywhere in a service or controller. The error middleware turns it
// into the JSON error format { success: false, message, code }.
class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ success: true, data });

module.exports = { AppError, ok };