const service = require('../services/seller.service');
const { ok } = require('../utils/response');

exports.getProfile = async (req, res) => {
  ok(res, { profile: await service.getProfile(req.user.id) });
};

exports.saveProfile = async (req, res) => {
  ok(res, { profile: await service.saveProfile(req.user.id, req.body) });
};

exports.overview = async (req, res) => {
  ok(res, await service.getOverview(req.user.id));
};

exports.createBook = async (req, res) => {
  ok(res, { book: await service.createBook(req.user.id, req.body) }, 201);
};

exports.updateBook = async (req, res) => {
  ok(res, { book: await service.updateBook(req.user.id, req.params.id, req.body) });
};

exports.unpublishBook = async (req, res) => {
  ok(res, { book: await service.unpublishBook(req.user.id, req.params.id) });
};