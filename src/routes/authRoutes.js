const express = require('express');
const authController = require('../controllers/authController');
const { validateBody } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const authValidators = require('../validators/authValidators');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', 
  authLimiter,
  validateBody(authValidators.login),
  authController.login
);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Authentication]
 */
router.post('/register',
  validateBody(authValidators.register),
  authController.register
);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Renovar token de acceso
 *     tags: [Authentication]
 */
router.post('/refresh-token',
  validateBody(authValidators.refreshToken),
  authController.refreshToken
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Authentication]
 */
router.post('/logout',
  authenticateToken,
  authController.logout
);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     tags: [Authentication]
 */
router.get('/me',
  authenticateToken,
  authController.getProfile
);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Cambiar contraseña
 *     tags: [Authentication]
 */
router.put('/change-password',
  authenticateToken,
  validateBody(authValidators.changePassword),
  authController.changePassword
);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   put:
 *     summary: Actualizar perfil
 *     tags: [Authentication]
 */
router.put('/profile',
  authenticateToken,
  validateBody(authValidators.updateProfile),
  authController.updateProfile
);

module.exports = router;