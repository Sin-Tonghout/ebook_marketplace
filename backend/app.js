const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const storage = require('./services/storage.service');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const authorRoutes = require('./routes/author.routes');
const sellerRoutes = require('./routes/seller.routes');
const bookRoutes = require('./routes/book.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');
const { errorHandler } = require('./middleware/error.middleware');

storage.init(); // makes sure the storage folders exist

const app = express();

// Needed on Render so req.ip and secure cookies work behind the proxy.
if (env.isProd) app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Cover images are public. Book files are NOT served here, only covers.
// helmet blocks cross-origin image loads by default, so allow it for covers.
app.use(
  '/media/covers',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(storage.dirs.covers, { index: false, dotfiles: 'ignore', maxAge: '7d' })
);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
});

app.use(errorHandler);

module.exports = app;