const express = require('express');
const prisma = require('../config/db');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, service: 'ebook-api' });
});

router.get('/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, database: 'connected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      code: 'DB_UNAVAILABLE',
    });
  }
});

module.exports = router;