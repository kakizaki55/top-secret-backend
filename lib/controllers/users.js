const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const response = await UserService.create(req.body);
    res.send(response);
  } catch (error) {
    next(error);
  }
});
