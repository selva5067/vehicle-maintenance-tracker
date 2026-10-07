const jwt = require('jsonwebtoken');

const DEFAULT_SECRET = 'f41830ded5db40eeeaacdfa026f10ffeed27e5ce5f0a05600daf1eb663532b15';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
