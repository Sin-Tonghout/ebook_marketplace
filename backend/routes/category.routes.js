const express = require('express');
const controller = require('../controllers/category.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireAuth, requireActive } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const v = require('../validators/category.validator');

const router = express.Router();

const adminOnly = [requireAuth, requireActive, requireRole('admin', 'super_admin')];

router.get('/', controller.list); // public
router.get('/admin', adminOnly, controller.listAdmin); // counts every book

router.put('/order', adminOnly, validate(v.reorderSchema), controller.reorder);
router.post('/', adminOnly, validate(v.categoryNameSchema), controller.create);
router.patch('/:id', adminOnly, validate(v.categoryNameSchema), controller.update);
router.delete('/:id', adminOnly, controller.remove);

module.exports = router;