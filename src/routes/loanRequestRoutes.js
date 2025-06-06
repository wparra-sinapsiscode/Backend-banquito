const express = require('express');
const loanRequestController = require('../controllers/loanRequestController');
const { validateBody, validateParams, validateQuery } = require('../middleware/validation');
const { authenticateToken, requireAdmin, requireAdminOrMember } = require('../middleware/auth');
const loanValidators = require('../validators/loanValidators');
const { paramSchemas } = require('../validators/commonValidators');

const router = express.Router();

/**
 * @swagger
 * /api/v1/loan-requests:
 *   get:
 *     summary: Obtener lista de solicitudes de préstamo
 *     tags: [Loan Requests]
 *   post:
 *     summary: Crear nueva solicitud de préstamo
 *     tags: [Loan Requests]
 */
router.route('/')
  .get(
    authenticateToken,
    requireAdminOrMember,
    validateQuery(loanValidators.requestQuery),
    loanRequestController.getLoanRequests
  )
  .post(
    authenticateToken,
    requireAdminOrMember,
    validateBody(loanValidators.createRequest),
    loanRequestController.createLoanRequest
  );

/**
 * @swagger
 * /api/v1/loan-requests/statistics:
 *   get:
 *     summary: Obtener estadísticas de solicitudes
 *     tags: [Loan Requests]
 */
router.get('/statistics',
  authenticateToken,
  requireAdmin,
  loanRequestController.getLoanRequestStatistics
);

/**
 * @swagger
 * /api/v1/loan-requests/pending:
 *   get:
 *     summary: Obtener solicitudes pendientes
 *     tags: [Loan Requests]
 */
router.get('/pending',
  authenticateToken,
  requireAdmin,
  loanRequestController.getPendingRequests
);

/**
 * @swagger
 * /api/v1/loan-requests/{id}:
 *   get:
 *     summary: Obtener solicitud por ID
 *     tags: [Loan Requests]
 *   put:
 *     summary: Actualizar solicitud
 *     tags: [Loan Requests]
 */
router.route('/:id')
  .get(
    authenticateToken,
    requireAdminOrMember,
    validateParams(paramSchemas.id),
    loanRequestController.getLoanRequestById
  )
  .put(
    authenticateToken,
    requireAdmin,
    validateParams(paramSchemas.id),
    validateBody(loanValidators.updateRequest),
    loanRequestController.updateLoanRequest
  );

/**
 * @swagger
 * /api/v1/loan-requests/{id}/approve:
 *   put:
 *     summary: Aprobar solicitud de préstamo
 *     tags: [Loan Requests]
 */
router.put('/:id/approve',
  authenticateToken,
  requireAdmin,
  validateParams(paramSchemas.id),
  validateBody(loanValidators.approveRequest),
  loanRequestController.approveLoanRequest
);

/**
 * @swagger
 * /api/v1/loan-requests/{id}/reject:
 *   put:
 *     summary: Rechazar solicitud de préstamo
 *     tags: [Loan Requests]
 */
router.put('/:id/reject',
  authenticateToken,
  requireAdmin,
  validateParams(paramSchemas.id),
  validateBody(loanValidators.updateRequest),
  loanRequestController.rejectLoanRequest
);

module.exports = router;