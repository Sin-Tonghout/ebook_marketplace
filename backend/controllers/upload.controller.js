const service = require('../services/upload.service');
const { ok } = require('../utils/response');

exports.uploadBook = async (req, res) => {
  ok(res, { upload: await service.registerUpload(req.user.id, 'book', req.file) }, 201);
};

exports.uploadCover = async (req, res) => {
  ok(res, { upload: await service.registerUpload(req.user.id, 'cover', req.file) }, 201);
};

exports.remove = async (req, res) => {
  await service.removeUpload(req.user.id, req.params.id);
  ok(res, {});
};