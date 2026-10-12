const service = require('../services/author.service');
const { ok } = require('../utils/response');

exports.list = async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  ok(res, { authors: await service.listPopular(limit) });
};

exports.get = async (req, res) => {
  ok(res, { author: await service.getById(req.params.id) });
};