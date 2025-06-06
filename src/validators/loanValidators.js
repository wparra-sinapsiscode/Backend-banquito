const Joi = require('joi');
const { LOAN_STATUS, LOAN_REQUEST_STATUS } = require('../config/constants');
const { commonValidators, querySchemas } = require('./commonValidators');

const loanValidators = {
  // Crear préstamo
  create: Joi.object({
    memberId: commonValidators.id,
    loanRequestId: commonValidators.id.optional(),
    originalAmount: commonValidators.amount,
    monthlyInterestRate: commonValidators.percentage,
    totalWeeks: commonValidators.weeks,
    startDate: commonValidators.date,
    notes: commonValidators.optionalString(0, 1000)
  }),

  // Actualizar préstamo
  update: Joi.object({
    monthlyInterestRate: commonValidators.percentage.optional(),
    status: Joi.string().valid(...Object.values(LOAN_STATUS)).optional(),
    notes: commonValidators.optionalString(0, 1000)
  }),

  // Filtros de búsqueda de préstamos
  query: querySchemas.paginationWithSearch.keys({
    memberId: commonValidators.id.optional(),
    status: Joi.string().valid(...Object.values(LOAN_STATUS)).optional(),
    startDate: commonValidators.dateOptional,
    endDate: commonValidators.dateOptional,
    minAmount: commonValidators.amount.optional(),
    maxAmount: commonValidators.amount.optional(),
    sortBy: Joi.string().valid('originalAmount', 'startDate', 'dueDate', 'createdAt').optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  // Registrar pago
  createPayment: Joi.object({
    amount: commonValidators.amount,
    weekNumber: Joi.number().integer().min(1).required(),
    lateFee: commonValidators.amount.default(0),
    notes: commonValidators.optionalString(0, 500),
    paymentDate: commonValidators.date.optional()
  }),

  // Crear solicitud de préstamo
  createRequest: Joi.object({
    memberId: commonValidators.id,
    requestedAmount: commonValidators.amount,
    purpose: commonValidators.requiredString(5, 255)
  }),

  // Actualizar solicitud de préstamo
  updateRequest: Joi.object({
    status: Joi.string().valid(...Object.values(LOAN_REQUEST_STATUS)).required(),
    notes: commonValidators.optionalString(0, 1000)
  }),

  // Aprobar solicitud
  approveRequest: Joi.object({
    monthlyInterestRate: commonValidators.percentage,
    totalWeeks: commonValidators.weeks,
    notes: commonValidators.optionalString(0, 1000)
  }),

  // Filtros de solicitudes
  requestQuery: querySchemas.paginationWithSearch.keys({
    memberId: commonValidators.id.optional(),
    status: Joi.string().valid(...Object.values(LOAN_REQUEST_STATUS)).optional(),
    requestDate: commonValidators.dateOptional,
    minAmount: commonValidators.amount.optional(),
    maxAmount: commonValidators.amount.optional(),
    sortBy: Joi.string().valid('requestedAmount', 'requestDate', 'createdAt').optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  // Consulta de cronograma
  scheduleQuery: Joi.object({
    includePayments: Joi.boolean().default(false)
  })
};

module.exports = loanValidators;