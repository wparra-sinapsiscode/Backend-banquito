const fixedSavingService = require('../services/fixedSavingService');

class FixedSavingController {
  async createFixedSaving(req, res, next) {
    try {
      const { memberId } = req.params;
      const fixedSavingData = req.body;
      
      const fixedSaving = await fixedSavingService.createFixedSaving(memberId, fixedSavingData);
      
      res.status(201).json({
        success: true,
        message: 'Plan de ahorro a plazo fijo creado exitosamente',
        data: fixedSaving
      });
    } catch (error) {
      next(error);
    }
  }

  async getFixedSavingById(req, res, next) {
    try {
      const { id } = req.params;
      
      const fixedSaving = await fixedSavingService.getFixedSavingById(id);
      
      res.json({
        success: true,
        data: fixedSaving
      });
    } catch (error) {
      next(error);
    }
  }

  async getFixedSavingsByMember(req, res, next) {
    try {
      const { memberId } = req.params;
      const filters = req.query;
      
      const fixedSavings = await fixedSavingService.getFixedSavingsByMember(memberId, filters);
      
      res.json({
        success: true,
        data: fixedSavings
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllFixedSavings(req, res, next) {
    try {
      const filters = req.query;
      
      const fixedSavings = await fixedSavingService.getAllFixedSavings(filters);
      
      res.json({
        success: true,
        data: fixedSavings
      });
    } catch (error) {
      next(error);
    }
  }

  async updateFixedSaving(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const fixedSaving = await fixedSavingService.updateFixedSaving(id, updateData);
      
      res.json({
        success: true,
        message: 'Plan de ahorro actualizado exitosamente',
        data: fixedSaving
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelFixedSaving(req, res, next) {
    try {
      const { id } = req.params;
      
      const fixedSaving = await fixedSavingService.cancelFixedSaving(id);
      
      res.json({
        success: true,
        message: 'Plan de ahorro cancelado exitosamente',
        data: fixedSaving
      });
    } catch (error) {
      next(error);
    }
  }

  async matureFixedSaving(req, res, next) {
    try {
      const { id } = req.params;
      
      const fixedSaving = await fixedSavingService.matureFixedSaving(id);
      
      res.json({
        success: true,
        message: 'Plan de ahorro madurado exitosamente',
        data: fixedSaving
      });
    } catch (error) {
      next(error);
    }
  }

  async getFixedSavingsStatistics(req, res, next) {
    try {
      const statistics = await fixedSavingService.getFixedSavingsStatistics();
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FixedSavingController();