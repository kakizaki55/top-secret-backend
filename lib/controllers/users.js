const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const response = await UserService.create(req.body);
      res.send(response);
    } catch (error) {
      next(error);
    }
  })
  .post('/session', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const sessionToken = await UserService.signIn({ email, password });

      res
        .cookie('session', sessionToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        })
        .send({ message: 'Signed in successfully!' });
    } catch (error) {
      next(error);
    }
  });
