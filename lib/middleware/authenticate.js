const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const { session } = req.cookies;
    const payload = jwt.verify(session, process.env.JWT_SECRETS);
    req.user = payload;

    next();
  } catch (error) {
    error.status = 401;
    error.message = 'you need to be logged in to see this';
    next(error);
  }
};
