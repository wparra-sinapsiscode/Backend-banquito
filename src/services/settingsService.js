const { Settings } = require('../models');

class SettingsService {
  async getAllSettings() {
    try {
      const settings = await Settings.findAll({
        order: [['category', 'ASC'], ['key', 'ASC']]
      });

      // Convertir a objeto estructurado por categoría
      const settingsObject = settings.reduce((acc, setting) => {
        if (!acc[setting.category]) {
          acc[setting.category] = {};
        }
        
        // Intentar parsear JSON, si falla usar valor como string
        let value;
        try {
          value = JSON.parse(setting.value);
        } catch {
          value = setting.value;
        }
        
        acc[setting.category][setting.key] = value;
        return acc;
      }, {});

      return settingsObject;
    } catch (error) {
      throw new Error(`Error al obtener configuraciones: ${error.message}`);
    }
  }

  async getSettingByKey(key) {
    try {
      const setting = await Settings.findOne({ where: { key } });
      
      if (!setting) {
        throw new Error(`Configuración '${key}' no encontrada`);
      }

      // Intentar parsear JSON, si falla usar valor como string
      let value;
      try {
        value = JSON.parse(setting.value);
      } catch {
        value = setting.value;
      }

      return {
        key: setting.key,
        value: value,
        description: setting.description,
        category: setting.category
      };
    } catch (error) {
      throw error;
    }
  }

  async createSetting(settingData) {
    try {
      const { key, value, description, category = 'general' } = settingData;

      // Verificar que no exista la clave
      const existingSetting = await Settings.findOne({ where: { key } });
      if (existingSetting) {
        throw new Error(`La configuración '${key}' ya existe`);
      }

      // Convertir valor a JSON string si es objeto
      const valueString = typeof value === 'object' ? JSON.stringify(value) : String(value);

      const setting = await Settings.create({
        key,
        value: valueString,
        description,
        category
      });

      return setting;
    } catch (error) {
      throw error;
    }
  }

  async updateSettings(settingsData) {
    try {
      const updatedSettings = [];

      // Procesar cada configuración
      for (const [category, categorySettings] of Object.entries(settingsData)) {
        for (const [key, value] of Object.entries(categorySettings)) {
          const valueString = typeof value === 'object' ? JSON.stringify(value) : String(value);
          
          const [setting, created] = await Settings.findOrCreate({
            where: { key },
            defaults: {
              key,
              value: valueString,
              category
            }
          });

          if (!created) {
            setting.value = valueString;
            setting.category = category;
            await setting.save();
          }

          updatedSettings.push(setting);
        }
      }

      return await this.getAllSettings();
    } catch (error) {
      throw new Error(`Error al actualizar configuraciones: ${error.message}`);
    }
  }

  async deleteSetting(key) {
    try {
      const setting = await Settings.findOne({ where: { key } });
      
      if (!setting) {
        throw new Error(`Configuración '${key}' no encontrada`);
      }

      await setting.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getSystemConfiguration() {
    try {
      const settings = await this.getAllSettings();
      
      // Estructura específica para el sistema bancario
      return {
        shareValue: settings.financial?.shareValue || 500,
        loanLimits: settings.financial?.loanLimits || {
          individual: 8000,
          guaranteePercentage: 80
        },
        monthlyInterestRates: settings.financial?.monthlyInterestRates || {
          high: 3,
          medium: 5,
          low: 10
        },
        operationDay: settings.system?.operationDay || 'wednesday',
        delinquencyRate: settings.financial?.delinquencyRate || 5.0,
        systemName: settings.system?.systemName || 'Sistema Banquito',
        companyInfo: settings.system?.companyInfo || {
          name: 'Cooperativa Banquito',
          address: '',
          phone: '',
          email: ''
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener configuración del sistema: ${error.message}`);
    }
  }

  async initializeDefaultSettings() {
    try {
      const defaultSettings = [
        // Configuraciones financieras
        { key: 'shareValue', value: '500', category: 'financial', description: 'Valor por acción en pesos' },
        { key: 'loanLimits', value: JSON.stringify({ individual: 8000, guaranteePercentage: 80 }), category: 'financial', description: 'Límites de préstamos' },
        { key: 'monthlyInterestRates', value: JSON.stringify({ high: 3, medium: 5, low: 10 }), category: 'financial', description: 'Tasas de interés mensual por tramo' },
        { key: 'delinquencyRate', value: '5.0', category: 'financial', description: 'Tasa de recargo por mora (%)' },
        
        // Configuraciones del sistema
        { key: 'operationDay', value: 'wednesday', category: 'system', description: 'Día de operaciones de la semana' },
        { key: 'systemName', value: 'Sistema Banquito', category: 'system', description: 'Nombre del sistema' },
        { key: 'companyInfo', value: JSON.stringify({ name: 'Cooperativa Banquito', address: '', phone: '', email: '' }), category: 'system', description: 'Información de la empresa' }
      ];

      for (const setting of defaultSettings) {
        await Settings.findOrCreate({
          where: { key: setting.key },
          defaults: setting
        });
      }

      return true;
    } catch (error) {
      throw new Error(`Error al inicializar configuraciones por defecto: ${error.message}`);
    }
  }
}

module.exports = new SettingsService();