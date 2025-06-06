const Joi = require('joi');
const { ROLES } = require('../config/constants');

const authValidators = {
  // Login
  login: Joi.object({
    username: Joi.string().trim().min(3).max(50).required()
      .messages({
        'string.min': 'Usuario debe tener al menos 3 caracteres',
        'string.max': 'Usuario no puede exceder 50 caracteres'
      }),
    password: Joi.string().min(6).required()
      .messages({
        'string.min': 'Contraseña debe tener al menos 6 caracteres'
      })
  }),

  // Registro de usuario
  register: Joi.object({
    username: Joi.string().trim().min(3).max(50).required()
      .pattern(/^[a-zA-Z0-9_]+$/)
      .messages({
        'string.pattern.base': 'Usuario solo puede contener letras, números y guiones bajos'
      }),
    password: Joi.string().min(8).max(128).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        'string.min': 'Contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'Contraseña debe contener al menos una mayúscula, una minúscula y un número'
      }),
    name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.min': 'Nombre debe tener al menos 2 caracteres'
      }),
    role: Joi.string().valid(...Object.values(ROLES)).default(ROLES.MEMBER),
    memberId: Joi.number().integer().positive().optional()
      .when('role', {
        is: ROLES.MEMBER,
        then: Joi.required(),
        otherwise: Joi.optional()
      })
  }),

  // Cambio de contraseña
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        'string.pattern.base': 'Nueva contraseña debe contener al menos una mayúscula, una minúscula y un número'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({
        'any.only': 'Confirmación de contraseña no coincide'
      })
  }),

  // Refresh token
  refreshToken: Joi.object({
    refreshToken: Joi.string().required()
  }),

  // Actualizar perfil
  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    username: Joi.string().trim().min(3).max(50).optional()
      .pattern(/^[a-zA-Z0-9_]+$/)
  })
};

module.exports = authValidators;