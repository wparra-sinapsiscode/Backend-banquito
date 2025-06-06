const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticateToken } = require('../middleware/auth');
const { validate, validateParams, validateBody } = require('../middleware/validation');
const { settingsValidators } = require('../validators/settingsValidators');

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/v1/settings - Obtener todas las configuraciones
router.get('/', settingsController.getAllSettings);

// GET /api/v1/settings/system-config - Obtener configuración estructurada del sistema
router.get('/system-config', settingsController.getSystemConfiguration);

// GET /api/v1/settings/:key - Obtener configuración por clave
router.get('/:key', 
  validateParams(settingsValidators.getByKey.params), 
  settingsController.getSettingByKey
);

// POST /api/v1/settings - Crear nueva configuración
router.post('/', 
  validateBody(settingsValidators.create.body), 
  settingsController.createSetting
);

// PUT /api/v1/settings - Actualizar configuraciones (múltiples)
router.put('/', 
  validateBody(settingsValidators.update.body), 
  settingsController.updateSettings
);

// DELETE /api/v1/settings/:key - Eliminar configuración
router.delete('/:key', 
  validateParams(settingsValidators.delete.params), 
  settingsController.deleteSetting
);

module.exports = router;