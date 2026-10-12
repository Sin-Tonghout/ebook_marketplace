const express = require('express');
const controller = require('../controllers/author.controller');

const router = express.Router();

router.get('/', controller.list); // public
router.get('/:id', controller.get); // public

module.exports = router;