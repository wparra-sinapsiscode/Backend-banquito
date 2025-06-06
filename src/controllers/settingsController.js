const settingsService = require('../services/settingsService');

class SettingsController {
  async getAllSettings(req, res, next) {
    try {
      const settings = await settingsService.getAllSettings();
      
      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      next(error);
    }
  }

  async getSettingByKey(req, res, next) {
    try {
      const { key } = req.params;
      
      const setting = await settingsService.getSettingByKey(key);
      
      res.json({
        success: true,
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const settingsData = req.body;
      
      const updatedSettings = await settingsService.updateSettings(settingsData);
      
      res.json({
        success: true,
        message: 'Configuraciones actualizadas exitosamente',
        data: updatedSettings
      });
    } catch (error) {
      next(error);
    }
  }

  async createSetting(req, res, next) {
    try {
      const settingData = req.body;
      
      const setting = await settingsService.createSetting(settingData);
      
      res.status(201).json({
        success: true,
        message: 'Configuración creada exitosamente',
        data: setting
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSetting(req, res, next) {
    try {
      const { key } = req.params;
      
      await settingsService.deleteSetting(key);
      
      res.json({
        success: true,
        message: 'Configuración eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async getSystemConfiguration(req, res, next) {
    try {
      const configuration = await settingsService.getSystemConfiguration();
      
      res.json({
        success: true,
        data: configuration
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();