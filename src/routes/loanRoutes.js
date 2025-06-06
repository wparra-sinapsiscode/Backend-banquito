const express = require('express');
const loanController = require('../controllers/loanController');
const { validateBody, validateParams, validateQuery } = require('../middleware/validation');
const { authenticateToken, requireAdmin, requireAdminOrMember } = require('../middleware/auth');
const loanValidators = require('../validators/loanValidators');
const { paramSchemas } = require('../validators/commonValidators');

const router = express.Router();

/**
 * @swagger
 * /api/v1/loans:
 *   get:
 *     summary: Obtener lista de préstamos
 *     tags: [Loans]
 *   post:
 *     summary: Crear nuevo préstamo
 *     tags: [Loans]
 */
router.route('/')
  .get(
    authenticateToken,
    requireAdminOrMember,
    validateQuery(loanValidators.query),
    loanController.getLoans
  )
  .post(
    authenticateToken,
    requireAdmin,
    validateBody(loanValidators.create),
    loanController.createLoan
  );

/**
 * @swagger
 * /api/v1/loans/statistics:
 *   get:
 *     summary: Obtener estadísticas de préstamos
 *     tags: [Loans]
 */
router.get('/statistics',
  authenticateToken,
  requireAdmin,
  loanController.getLoanStatistics
);

/**
 * @swagger
 * /api/v1/loans/overdue:
 *   get:
 *     summary: Obtener préstamos vencidos
 *     tags: [Loans]
 */
router.get('/overdue',
  authenticateToken,
  requireAdmin,
  loanController.getOverdueLoans
);

/**
 * @swagger
 * /api/v1/loans/{id}:
 *   get:
 *     summary: Obtener préstamo por ID
 *     tags: [Loans]
 *   put:
 *     summary: Actualizar préstamo
 *     tags: [Loans]
 */
router.route('/:id')
  .get(
    authenticateToken,
    requireAdminOrMember,
    validateParams(paramSchemas.id),
    loanController.getLoanById
  )
  .put(
    authenticateToken,
    requireAdmin,
    validateParams(paramSchemas.id),
    validateBody(loanValidators.update),
    loanController.updateLoan
  );

/**
 * @swagger
 * /api/v1/loans/{id}/payments:
 *   get:
 *     summary: Obtener historial de pagos del préstamo
 *     tags: [Loans]
 *   post:
 *     summary: Registrar nuevo pago
 *     tags: [Loans]
 */
router.route('/:id/payments')
  .get(
    authenticateToken,
    requireAdminOrMember,
    validateParams(paramSchemas.id),
    loanController.getLoanPayments
  )
  .post(
    authenticateToken,
    requireAdmin,
    validateParams(paramSchemas.id),
    validateBody(loanValidators.createPayment),
    loanController.createPayment
  );

/**
 * @swagger
 * /api/v1/loans/{id}/schedule:
 *   get:
 *     summary: Obtener cronograma de pagos del préstamo
 *     tags: [Loans]
 */
router.get('/:id/schedule',
  authenticateToken,
  requireAdminOrMember,
  validateParams(paramSchemas.id),
  validateQuery(loanValidators.scheduleQuery),
  loanController.getLoanSchedule
);

module.exports = router;