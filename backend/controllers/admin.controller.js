const service = require('../services/admin.service');
const { ok } = require('../utils/response');

exports.stats = async (req, res) => {
  ok(res, await service.getStats());
};

exports.listBooks = async (req, res) => {
  ok(res, { books: await service.listBooks() });
};

exports.moderateBook = async (req, res) => {
  const { action, reason } = req.body;
  ok(res, { book: await service.moderateBook(req.user, req.params.id, action, reason) });
};