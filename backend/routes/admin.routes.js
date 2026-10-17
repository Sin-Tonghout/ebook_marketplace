const express = require('express');
const controller = require('../controllers/admin.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireAuth, requireActive } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const v = require('../validators/admin.validator');

const router = express.Router();

const adminOnly = [requireAuth, requireActive, requireRole('admin', 'super_admin')];

router.get('/stats', adminOnly, controller.stats);
router.get('/books', adminOnly, controller.listBooks);
router.post(
  '/books/:id/moderate',
  adminOnly,
  validate(v.moderateBookSchema),
  controller.moderateBook
);

module.exports = router;