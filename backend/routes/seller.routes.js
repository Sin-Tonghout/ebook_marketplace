const express = require('express');
const controller = require('../controllers/seller.controller');
const { validate } = require('../middleware/validate.middleware');
const { requireAuth, requireActive } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const v = require('../validators/seller.validator');

const router = express.Router();

const sellerOnly = [requireAuth, requireRole('seller', 'admin', 'super_admin')];
const sellerActive = [...sellerOnly, requireActive];

router.get('/profile', sellerOnly, controller.getProfile);
router.put('/profile', sellerActive, validate(v.sellerProfileSchema), controller.saveProfile);

router.get('/overview', sellerOnly, controller.overview);

router.post('/books', sellerActive, validate(v.createBookSchema), controller.createBook);
router.patch('/books/:id', sellerActive, validate(v.updateBookSchema), controller.updateBook);
router.post('/books/:id/unpublish', sellerActive, controller.unpublishBook);

module.exports = router;