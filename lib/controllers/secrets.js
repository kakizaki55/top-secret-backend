const { Router } = require('express');
const Secret = require('../models/Secret');

module.exports = Router().post('/', async (req, res) => {
  const response = await Secret.insert(req.body);
  res.send(response);
});
