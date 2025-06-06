const { verifyToken } = require('../utils/encryption');
const { User } = require('../models');
const { ROLES } = require('../config/constants');

// Middleware para autenticar token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    const decoded = verifyToken(token);
    
    // Buscar usuario en la base de datos
    const user = await User.findByPk(decoded.userId, {
      include: ['member']
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no válido o inactivo'
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      memberId: user.memberId,
      member: user.member
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      error: error.message
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

// Middleware para verificar acceso a recursos del miembro
const requireMemberAccess = (req, res, next) => {
  const { role, memberId } = req.user;
  const requestedMemberId = parseInt(req.params.memberId || req.body.memberId);

  // Admin puede acceder a cualquier recurso
  if (role === ROLES.ADMIN) {
    return next();
  }

  // Miembro solo puede acceder a sus propios recursos
  if (role === ROLES.MEMBER && memberId === requestedMemberId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'No tienes permisos para acceder a este recurso'
  });
};

// Middleware para solo administradores
const requireAdmin = requireRole(ROLES.ADMIN);

// Middleware para administradores y miembros
const requireAdminOrMember = requireRole(ROLES.ADMIN, ROLES.MEMBER);

module.exports = {
  authenticateToken,
  requireRole,
  requireMemberAccess,
  requireAdmin,
  requireAdminOrMember
};