const { User, Member } = require('../models');
const { hashPassword, verifyPassword, generateToken, generateRefreshToken } = require('../utils/encryption');
const { ROLES } = require('../config/constants');

class AuthService {
  async login(username, password) {
    // Buscar usuario por username
    const user = await User.findOne({
      where: { username, isActive: true },
      include: [{
        model: Member,
        as: 'member',
        required: false
      }]
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Actualizar último login
    await user.update({ lastLogin: new Date() });

    // Generar tokens
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      memberId: user.memberId
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        memberId: user.memberId,
        member: user.member,
        lastLogin: user.lastLogin
      },
      accessToken,
      refreshToken
    };
  }

  async register(userData) {
    const { username, password, name, role = ROLES.MEMBER, memberId } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Si es un miembro, verificar que el miembro existe
    if (role === ROLES.MEMBER && memberId) {
      const member = await Member.findByPk(memberId);
      if (!member) {
        throw new Error('Miembro no encontrado');
      }

      // Verificar que el miembro no tenga ya un usuario
      const existingMemberUser = await User.findOne({ where: { memberId } });
      if (existingMemberUser) {
        throw new Error('Este miembro ya tiene un usuario asignado');
      }
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password);

    // Crear usuario
    const user = await User.create({
      username,
      passwordHash,
      name,
      role,
      memberId: role === ROLES.MEMBER ? memberId : null
    });

    // Buscar usuario con información del miembro
    const userWithMember = await User.findByPk(user.id, {
      include: [{
        model: Member,
        as: 'member',
        required: false
      }]
    });

    return {
      id: userWithMember.id,
      username: userWithMember.username,
      name: userWithMember.name,
      role: userWithMember.role,
      memberId: userWithMember.memberId,
      member: userWithMember.member
    };
  }

  async refreshToken(refreshToken) {
    try {
      const { verifyRefreshToken } = require('../utils/encryption');
      const decoded = verifyRefreshToken(refreshToken);

      // Verificar que el usuario aún existe y está activo
      const user = await User.findByPk(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('Usuario no válido');
      }

      // Generar nuevo access token
      const payload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        memberId: user.memberId
      };

      const accessToken = generateToken(payload);

      return { accessToken };
    } catch (error) {
      throw new Error('Refresh token inválido');
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Hash nueva contraseña
    const newPasswordHash = await hashPassword(newPassword);

    // Actualizar contraseña
    await user.update({ passwordHash: newPasswordHash });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async updateProfile(userId, updateData) {
    const { name, username } = updateData;
    
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Si se está actualizando el username, verificar que no exista
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('El nombre de usuario ya está en uso');
      }
    }

    await user.update({
      ...(name && { name }),
      ...(username && { username })
    });

    // Retornar usuario actualizado
    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Member,
        as: 'member',
        required: false
      }]
    });

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
      memberId: updatedUser.memberId,
      member: updatedUser.member
    };
  }

  async getUserById(userId) {
    const user = await User.findByPk(userId, {
      include: [{
        model: Member,
        as: 'member',
        required: false
      }]
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      memberId: user.memberId,
      member: user.member,
      lastLogin: user.lastLogin
    };
  }
}

module.exports = new AuthService();