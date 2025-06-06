const Joi = require('joi');
const { CREDIT_RATINGS } = require('../config/constants');
const { commonValidators, querySchemas } = require('./commonValidators');

const memberValidators = {
  // Crear miembro
  create: Joi.object({
    name: commonValidators.requiredString(2, 100),
    dni: commonValidators.dni,
    shares: commonValidators.shares.default(0),
    guarantee: commonValidators.amount.default(0),
    creditScore: commonValidators.creditScore.default(50),
    creditRating: Joi.string().valid(...Object.values(CREDIT_RATINGS)).optional(),
    phone: commonValidators.phone,
    email: commonValidators.email,
    address: commonValidators.optionalString(0, 500)
  }),

  // Actualizar miembro
  update: Joi.object({
    name: commonValidators.requiredString(2, 100).optional(),
    dni: commonValidators.dni.optional(),
    shares: commonValidators.shares.optional(),
    guarantee: commonValidators.amount.optional(),
    creditScore: commonValidators.creditScore.optional(),
    creditRating: Joi.string().valid(...Object.values(CREDIT_RATINGS)).optional(),
    phone: commonValidators.phone,
    email: commonValidators.email,
    address: commonValidators.optionalString(0, 500),
    isActive: Joi.boolean().optional()
  }),

  // Filtros de búsqueda
  query: querySchemas.paginationWithSearch.keys({
    creditRating: Joi.string().valid(...Object.values(CREDIT_RATINGS)).optional(),
    isActive: Joi.boolean().optional(),
    minShares: Joi.number().integer().min(0).optional(),
    maxShares: Joi.number().integer().min(0).optional(),
    minCreditScore: Joi.number().integer().min(1).max(90).optional(),
    maxCreditScore: Joi.number().integer().min(1).max(90).optional(),
    sortBy: Joi.string().valid('name', 'creditScore', 'shares', 'createdAt').optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
  }),

  // Actualizar plan de ahorros
  updateSavingsPlan: Joi.object({
    targetShares: Joi.number().integer().min(1).required(),
    monthlyContribution: commonValidators.amount.required(),
    isActive: Joi.boolean().optional().default(true)
  })
};

module.exports = memberValidators;