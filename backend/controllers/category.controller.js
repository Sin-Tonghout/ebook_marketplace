const service = require('../services/category.service');
const { ok } = require('../utils/response');

exports.list = async (req, res) => {
  ok(res, { categories: await service.list() });
};

exports.listAdmin = async (req, res) => {
  ok(res, { categories: await service.list({ includeUnpublished: true }) });
};

exports.create = async (req, res) => {
  ok(res, { category: await service.create(req.body.name, req.user) }, 201);
};

exports.update = async (req, res) => {
  ok(res, { category: await service.rename(req.params.id, req.body.name, req.user) });
};

exports.remove = async (req, res) => {
  await service.remove(req.params.id, req.user);
  ok(res, {});
};

exports.reorder = async (req, res) => {
  ok(res, { categories: await service.reorder(req.body.ids, req.user) });
};