const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = class UserService {
  static async create({ firstName, lastName, email, password }) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      firstName,
      lastName,
      email,
      hashedPassword,
    });
    return user;
  }
};
