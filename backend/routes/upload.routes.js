const express = require('express');
const controller = require('../controllers/upload.controller');
const { requireAuth, requireActive } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { uploadBookFile, uploadCoverFile } = require('../middleware/upload.middleware');

const router = express.Router();

// Sign-in and role are checked BEFORE multer reads the file body.
const sellerActive = [requireAuth, requireRole('seller', 'admin', 'super_admin'), requireActive];

router.post('/book', sellerActive, uploadBookFile, controller.uploadBook);
router.post('/cover', sellerActive, uploadCoverFile, controller.uploadCover);
router.delete('/:id', requireAuth, controller.remove);

module.exports = router;