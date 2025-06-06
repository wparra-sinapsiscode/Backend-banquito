const express = require('express');
const memberController = require('../controllers/memberController');
const { validateBody, validateParams, validateQuery } = require('../middleware/validation');
const { authenticateToken, requireAdmin, requireAdminOrMember, requireMemberAccess } = require('../middleware/auth');
const memberValidators = require('../validators/memberValidators');
const { paramSchemas } = require('../validators/commonValidators');

const router = express.Router();

/**
 * @swagger
 * /api/v1/members:
 *   get:
 *     summary: Obtener lista de miembros
 *     tags: [Members]
 *   post:
 *     summary: Crear nuevo miembro
 *     tags: [Members]
 */
router.route('/')
  .get(
    authenticateToken,
    requireAdminOrMember,
    validateQuery(memberValidators.query),
    memberController.getMembers
  )
  .post(
    authenticateToken,
    requireAdmin,
    validateBody(memberValidators.create),
    memberController.createMember
  );

/**
 * @swagger
 * /api/v1/members/statistics:
 *   get:
 *     summary: Obtener estadísticas de miembros
 *     tags: [Members]
 */
router.get('/statistics',
  authenticateToken,
  requireAdmin,
  memberController.getMemberStatistics
);

/**
 * @swagger
 * /api/v1/members/{id}:
 *   get:
 *     summary: Obtener miembro por ID
 *     tags: [Members]
 *   put:
 *     summary: Actualizar miembro
 *     tags: [Members]
 *   delete:
 *     summary: Eliminar miembro
 *     tags: [Members]
 */
router.route('/:id')
  .get(
    authenticateToken,
    requireAdminOrMember,
    validateParams(paramSchemas.id),
    requireMemberAccess,
    memberController.getMemberById
  )
  .put(
    authenticateToken,
    requireAdmin,
    validateParams(paramSchemas.id),
    validateBody(memberValidators.update),
    memberController.updateMember
  )
  .delete(
    authenticateToken,
    requireAdmin,
    validateParams(paramSchemas.id),
    memberController.deleteMember
  );

/**
 * @swagger
 * /api/v1/members/{id}/savings-plan:
 *   put:
 *     summary: Actualizar plan de ahorros del miembro
 *     tags: [Members]
 */
router.put('/:id/savings-plan',
  authenticateToken,
  requireAdminOrMember,
  validateParams(paramSchemas.id),
  validateBody(memberValidators.updateSavingsPlan),
  requireMemberAccess,
  memberController.updateSavingsPlan
);

module.exports = router;