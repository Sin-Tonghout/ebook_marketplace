// Usage: router.post('/login', validate(loginSchema), controller)
const validate = (schema) => (req, res, next) => {
  req.body = schema.parse(req.body); // throws ZodError, handled by errorHandler
  next();
};

module.exports = { validate };