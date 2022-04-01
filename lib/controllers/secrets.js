const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const response = await Secret.insert(req.body);
      res.send(response);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const response = await Secret.getAll();
      res.send(response);
    } catch (error) {
      next(error);
    }
  });
