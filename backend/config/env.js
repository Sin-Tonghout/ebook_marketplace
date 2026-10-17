require('dotenv').config();
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 5000;

const env = {
  port,
  nodeEnv,
  isProd: nodeEnv === 'production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  cookieName: 'ebook_session',
  sessionDays: 7,

  // Where uploaded files live. Local disk now; object storage in production.
  storageDir: path.resolve(__dirname, '..', process.env.STORAGE_DIR || 'storage'),
  // Public address of this API. Used to build cover image links.
  publicApiUrl: (process.env.PUBLIC_API_URL || `http://localhost:${port}`).replace(/\/$/, ''),

  maxBookBytes: 50 * 1024 * 1024,
  maxCoverBytes: 5 * 1024 * 1024,
};

module.exports = env;