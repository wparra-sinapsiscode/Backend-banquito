const Joi = require('joi');
const { paginationSchema } = require('./commonValidators');

const settingsValidators = {
  // Validación para obtener configuración por clave
  getByKey: {
    params: Joi.object({
      key: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'La clave es requerida',
        'string.min': 'La clave debe tener al menos 1 caracter',
        'string.max': 'La clave no puede tener más de 100 caracteres',
        'any.required': 'La clave es requerida'
      })
    })
  },

  // Validación para crear configuración
  create: {
    body: Joi.object({
      key: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'La clave es requerida',
        'string.min': 'La clave debe tener al menos 1 caracter',
        'string.max': 'La clave no puede tener más de 100 caracteres',
        'any.required': 'La clave es requerida'
      }),
      value: Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.object(),
        Joi.array()
      ).required().messages({
        'any.required': 'El valor es requerido'
      }),
      description: Joi.string().allow('').optional(),
      category: Joi.string().min(1).max(50).default('general').messages({
        'string.min': 'La categoría debe tener al menos 1 caracter',
        'string.max': 'La categoría no puede tener más de 50 caracteres'
      })
    })
  },

  // Validación para actualizar configuraciones
  update: {
    body: Joi.object().pattern(
      Joi.string(), // Nombre de categoría
      Joi.object().pattern(
        Joi.string(), // Clave de configuración
        Joi.alternatives().try(
          Joi.string(),
          Joi.number(),
          Joi.boolean(),
          Joi.object(),
          Joi.array()
        ) // Valor de configuración
      )
    ).min(1).messages({
      'object.min': 'Debe proporcionar al menos una configuración para actualizar'
    })
  },

  // Validación para eliminar configuración
  delete: {
    params: Joi.object({
      key: Joi.string().min(1).max(100).required().messages({
        'string.empty': 'La clave es requerida',
        'string.min': 'La clave debe tener al menos 1 caracter',
        'string.max': 'La clave no puede tener más de 100 caracteres',
        'any.required': 'La clave es requerida'
      })
    })
  },

  // Validación específica para configuraciones del sistema bancario
  systemConfig: {
    body: Joi.object({
      financial: Joi.object({
        shareValue: Joi.number().positive().messages({
          'number.positive': 'El valor de la acción debe ser positivo'
        }),
        loanLimits: Joi.object({
          individual: Joi.number().positive(),
          guaranteePercentage: Joi.number().min(0).max(100)
        }),
        monthlyInterestRates: Joi.object({
          high: Joi.number().min(0).max(100),
          medium: Joi.number().min(0).max(100),
          low: Joi.number().min(0).max(100)
        }),
        delinquencyRate: Joi.number().min(0).max(100)
      }),
      system: Joi.object({
        operationDay: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        systemName: Joi.string().min(1).max(100),
        companyInfo: Joi.object({
          name: Joi.string(),
          address: Joi.string().allow(''),
          phone: Joi.string().allow(''),
          email: Joi.string().email().allow('')
        })
      })
    }).min(1)
  }
};

module.exports = { settingsValidators };