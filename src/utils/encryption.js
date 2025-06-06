const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BCRYPT_SALT_ROUNDS } = require('../config/constants');

const encryption = {
  // Hash de contraseñas
  hashPassword: async (password) => {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  },

  // Verificar contraseña
  verifyPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  // Generar token JWT
  generateToken: (payload, expiresIn = process.env.JWT_EXPIRES_IN || '30m') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  },

  // Generar refresh token
  generateRefreshToken: (payload, expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d') => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
  },

  // Verificar token JWT
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  // Verificar refresh token
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Refresh token inválido');
    }
  },

  // Decodificar token sin verificar
  decodeToken: (token) => {
    return jwt.decode(token);
  }
};

module.exports = encryption;