const Joi = require('joi');

// Validadores comunes
const commonValidators = {
  // ID numérico
  id: Joi.number().integer().positive().required(),

  // Paginación
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  // DNI
  dni: Joi.string().pattern(/^\d{8,12}$/).required()
    .messages({
      'string.pattern.base': 'DNI debe tener entre 8 y 12 dígitos'
    }),

  // Email
  email: Joi.string().email().optional(),

  // Teléfono
  phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).min(9).max(20).optional()
    .messages({
      'string.pattern.base': 'Formato de teléfono inválido'
    }),

  // Monto decimal
  amount: Joi.number().precision(2).positive().required(),

  // Fecha
  date: Joi.date().iso().required(),

  // Fecha opcional
  dateOptional: Joi.date().iso().optional(),

  // Texto requerido
  requiredString: (min = 1, max = 255) => 
    Joi.string().trim().min(min).max(max).required(),

  // Texto opcional
  optionalString: (min = 0, max = 255) => 
    Joi.string().trim().min(min).max(max).optional().allow(''),

  // Porcentaje
  percentage: Joi.number().min(0).max(100).precision(2).required(),

  // Score crediticio
  creditScore: Joi.number().integer().min(1).max(90).required(),

  // Número de semanas
  weeks: Joi.number().integer().min(1).max(260).required(), // Máximo 5 años

  // Número de acciones
  shares: Joi.number().integer().min(0).required(),

  // Búsqueda
  search: Joi.string().trim().min(1).max(100).optional(),

  // Filtros comunes
  status: (allowedStatuses) => 
    Joi.string().valid(...allowedStatuses).optional(),

  // Filtro de fecha
  dateRange: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional()
  }).with('endDate', 'startDate'),

  // Ordenamiento
  sorting: Joi.object({
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
  })
};

// Esquemas de parámetros comunes
const paramSchemas = {
  id: Joi.object({
    id: commonValidators.id
  }),

  memberId: Joi.object({
    memberId: commonValidators.id
  }),

  loanId: Joi.object({
    loanId: commonValidators.id
  })
};

// Esquemas de query comunes
const querySchemas = {
  pagination: commonValidators.pagination,
  
  paginationWithSearch: commonValidators.pagination.keys({
    search: commonValidators.search
  }),

  paginationWithFilters: commonValidators.pagination.keys({
    search: commonValidators.search,
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
  })
};

module.exports = {
  commonValidators,
  paramSchemas,
  querySchemas
};