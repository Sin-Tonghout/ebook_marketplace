const app = require('./app');
const env = require('./config/env');
const { cleanupExpiredUploads } = require('./services/upload.service');

// 0.0.0.0 so it also works on Render later
app.listen(env.port, '0.0.0.0', () => {
  console.log(`API running on http://localhost:${env.port}`);
});

// Remove expired temporary uploads now and then every hour.
const cleanup = () =>
  cleanupExpiredUploads().catch((err) => console.error('Upload cleanup failed:', err.message));
cleanup();
setInterval(cleanup, 60 * 60 * 1000).unref();