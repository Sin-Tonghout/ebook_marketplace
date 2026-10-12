const service = require('../services/book.service');
const { ok } = require('../utils/response');
const { listQuerySchema } = require('../validators/book.validator');

exports.list = async (req, res) => {
  const query = listQuerySchema.parse(req.query);
  ok(res, await service.list(query));
};

exports.get = async (req, res) => {
  ok(res, await service.getDetail(req.params.id));
};