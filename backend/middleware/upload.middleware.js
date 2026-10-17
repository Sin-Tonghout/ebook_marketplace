const crypto = require('crypto');
const multer = require('multer');
const env = require('../config/env');
const storage = require('../services/storage.service');
const { AppError } = require('../utils/response');

// Files are written to storage/tmp under a random name. The uploader's file
// name is never used for storage.
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storage.dirs.tmp),
  filename: (req, file, cb) => cb(null, crypto.randomUUID()),
});

function singleFile(maxBytes, tooLargeMessage) {
  const run = multer({
    storage: diskStorage,
    limits: { fileSize: maxBytes, files: 1 },
  }).single('file');

  return (req, res, next) => {
    run(req, res, (err) => {
      if (!err) return next();
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError(413, 'FILE_TOO_LARGE', tooLargeMessage));
        }
        return next(new AppError(400, 'UPLOAD_FAILED', 'The upload could not be read. Try again.'));
      }
      next(err);
    });
  };
}

const uploadBookFile = singleFile(
  env.maxBookBytes,
  `This file is too large. The maximum is ${env.maxBookBytes / (1024 * 1024)} MB.`
);
const uploadCoverFile = singleFile(
  env.maxCoverBytes,
  `This image is too large. The maximum is ${env.maxCoverBytes / (1024 * 1024)} MB.`
);

module.exports = { uploadBookFile, uploadCoverFile };