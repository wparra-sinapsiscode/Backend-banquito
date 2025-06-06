const Joi = require('joi');

const fixedSavingSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .min(100)
    .max(100000)
    .required()
    .messages({
      'number.base': 'El monto debe ser un número',
      'number.positive': 'El monto debe ser positivo',
      'number.min': 'El monto mínimo es S/ 100',
      'number.max': 'El monto máximo es S/ 100,000',
      'any.required': 'El monto es requerido'
    }),

  termDays: Joi.number()
    .integer()
    .min(30)
    .max(1095) // 3 años máximo
    .required()
    .messages({
      'number.base': 'El plazo debe ser un número',
      'number.integer': 'El plazo debe ser un número entero',
      'number.min': 'El plazo mínimo es 30 días',
      'number.max': 'El plazo máximo es 1095 días (3 años)',
      'any.required': 'El plazo es requerido'
    }),

  annualRate: Joi.number()
    .precision(2)
    .min(0.01)
    .max(50)
    .default(2.00)
    .messages({
      'number.base': 'La tasa anual debe ser un número',
      'number.min': 'La tasa anual mínima es 0.01%',
      'number.max': 'La tasa anual máxima es 50%'
    }),

  startDate: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.base': 'La fecha de inicio debe ser una fecha válida',
      'date.min': 'La fecha de inicio no puede ser anterior a hoy',
      'any.required': 'La fecha de inicio es requerida'
    }),

  notes: Joi.string()
    .max(500)
    .allow(null, '')
    .messages({
      'string.max': 'Las notas no pueden exceder 500 caracteres'
    })
});

const updateFixedSavingSchema = Joi.object({
  status: Joi.string()
    .valid('active', 'matured', 'cancelled')
    .messages({
      'string.base': 'El estado debe ser un texto',
      'any.only': 'El estado debe ser: active, matured o cancelled'
    }),

  notes: Joi.string()
    .max(500)
    .allow(null, '')
    .messages({
      'string.max': 'Las notas no pueden exceder 500 caracteres'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

const validateFixedSaving = (req, res, next) => {
  const { error } = fixedSavingSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
  }

  next();
};

const validateUpdateFixedSaving = (req, res, next) => {
  const { error } = updateFixedSavingSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
  }

  next();
};

module.exports = {
  validateFixedSaving,
  validateUpdateFixedSaving,
  fixedSavingSchema,
  updateFixedSavingSchema
};