const express = require('express');
const fixedSavingController = require('../controllers/fixedSavingController');
const { authenticateToken } = require('../middleware/auth');
const { validateFixedSaving } = require('../validators/fixedSavingValidators');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     FixedSaving:
 *       type: object
 *       required:
 *         - amount
 *         - termDays
 *         - annualRate
 *         - startDate
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del plan de ahorro
 *         memberId:
 *           type: integer
 *           description: ID del miembro
 *         amount:
 *           type: number
 *           format: decimal
 *           description: Monto inicial del depósito
 *         termDays:
 *           type: integer
 *           description: Plazo en días
 *         annualRate:
 *           type: number
 *           format: decimal
 *           description: Tasa anual (%)
 *         startDate:
 *           type: string
 *           format: date
 *           description: Fecha de inicio
 *         endDate:
 *           type: string
 *           format: date
 *           description: Fecha de vencimiento
 *         maturityAmount:
 *           type: number
 *           format: decimal
 *           description: Monto al vencimiento
 *         status:
 *           type: string
 *           enum: [active, matured, cancelled]
 *           description: Estado del plan
 */

/**
 * @swagger
 * /api/v1/fixed-savings:
 *   get:
 *     summary: Obtener todos los planes de ahorro a plazo fijo
 *     tags: [FixedSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, matured, cancelled]
 *         description: Filtrar por estado
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: integer
 *         description: Filtrar por miembro
 *     responses:
 *       200:
 *         description: Lista de planes de ahorro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FixedSaving'
 */
router.get('/', fixedSavingController.getAllFixedSavings);

/**
 * @swagger
 * /api/v1/fixed-savings/statistics:
 *   get:
 *     summary: Obtener estadísticas de planes de ahorro
 *     tags: [FixedSavings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de planes de ahorro
 */
router.get('/statistics', fixedSavingController.getFixedSavingsStatistics);

/**
 * @swagger
 * /api/v1/fixed-savings/{id}:
 *   get:
 *     summary: Obtener plan de ahorro por ID
 *     tags: [FixedSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del plan de ahorro
 *     responses:
 *       200:
 *         description: Plan de ahorro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FixedSaving'
 */
router.get('/:id', fixedSavingController.getFixedSavingById);

/**
 * @swagger
 * /api/v1/fixed-savings/{id}:
 *   put:
 *     summary: Actualizar plan de ahorro
 *     tags: [FixedSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del plan de ahorro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, matured, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plan de ahorro actualizado
 */
router.put('/:id', fixedSavingController.updateFixedSaving);

/**
 * @swagger
 * /api/v1/fixed-savings/{id}/cancel:
 *   put:
 *     summary: Cancelar plan de ahorro
 *     tags: [FixedSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del plan de ahorro
 *     responses:
 *       200:
 *         description: Plan de ahorro cancelado
 */
router.put('/:id/cancel', fixedSavingController.cancelFixedSaving);

/**
 * @swagger
 * /api/v1/fixed-savings/{id}/mature:
 *   put:
 *     summary: Madurar plan de ahorro
 *     tags: [FixedSavings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del plan de ahorro
 *     responses:
 *       200:
 *         description: Plan de ahorro madurado
 */
router.put('/:id/mature', fixedSavingController.matureFixedSaving);

module.exports = router;