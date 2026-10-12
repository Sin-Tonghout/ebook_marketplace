const express = require('express');
const controller = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireAuth } = require('../middleware/auth.middleware');
const v = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(v.registerSchema), controller.register);
router.post('/login', validate(v.loginSchema), controller.login);
router.post('/logout', controller.logout);
router.get('/me', controller.me);

router.post('/forgot-password', validate(v.forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(v.resetPasswordSchema), controller.resetPassword);

router.patch('/profile', requireAuth, validate(v.updateProfileSchema), controller.updateProfile);
router.post('/become-seller', requireAuth, validate(v.becomeSellerSchema), controller.becomeSeller);

module.exports = router;