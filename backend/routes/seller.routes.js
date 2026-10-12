const express = require('express');
const controller = require('../controllers/seller.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireAuth, requireActive } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const v = require('../validators/seller.validator');

const router = express.Router();

const sellerOnly = [requireAuth, requireRole('seller', 'admin', 'super_admin')];

router.get('/profile', sellerOnly, controller.getProfile);
router.put(
  '/profile',
  [...sellerOnly, requireActive],
  validate(v.sellerProfileSchema),
  controller.saveProfile
);

module.exports = router;