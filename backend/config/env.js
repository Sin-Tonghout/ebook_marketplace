require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';

const env = {
  port: process.env.PORT || 5000,
  nodeEnv,
  isProd: nodeEnv === 'production',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  cookieName: 'ebook_session',
  sessionDays: 7,
};

module.exports = env;