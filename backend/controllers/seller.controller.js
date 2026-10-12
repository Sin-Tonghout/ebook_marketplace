const service = require('../services/seller.service');
const { ok } = require('../utils/response');

exports.getProfile = async (req, res) => {
  ok(res, { profile: await service.getProfile(req.user.id) });
};

exports.saveProfile = async (req, res) => {
  ok(res, { profile: await service.saveProfile(req.user.id, req.body) });
};