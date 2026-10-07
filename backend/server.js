const app = require('./app');
const env = require('./config/env');

// 0.0.0.0 so it also works on Render later
app.listen(env.port, '0.0.0.0', () => {
  console.log(`API running on http://localhost:${env.port}`);
});