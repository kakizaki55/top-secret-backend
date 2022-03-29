const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

  static async signIn({ email, password }) {
    try {
      const user = await User.getByEmail(email);
      //   console.log('user', user);
      if (!user) throw new Error('Invalid email!');
      //   console.log('password', user.hashedPassword);

      if (!bcrypt.compareSync(password, user.hashedPassword))
        throw new Error('invalid password');

      const sessionToken = jwt.sign({ ...user }, process.env.JWT_SECRETS, {
        expiresIn: '1 day',
      });
      return sessionToken;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
