const memberService = require('../services/memberService');
const fixedSavingService = require('../services/fixedSavingService');

class MemberController {
  async createMember(req, res, next) {
    try {
      const memberData = req.body;
      
      const member = await memberService.createMember(memberData);
      
      res.status(201).json({
        success: true,
        message: 'Miembro creado exitosamente',
        data: member
      });
    } catch (error) {
      next(error);
    }
  }

  async getMemberById(req, res, next) {
    try {
      const { id } = req.params;
      
      const member = await memberService.getMemberById(id);
      
      res.json({
        success: true,
        data: member
      });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req, res, next) {
    try {
      const filters = req.query;
      
      const result = await memberService.getMembers(filters);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMember(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const member = await memberService.updateMember(id, updateData);
      
      res.json({
        success: true,
        message: 'Miembro actualizado exitosamente',
        data: member
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMember(req, res, next) {
    try {
      const { id } = req.params;
      
      const result = await memberService.deleteMember(id);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSavingsPlan(req, res, next) {
    try {
      const { id } = req.params;
      const planData = req.body;
      
      const savingsPlan = await memberService.updateSavingsPlan(id, planData);
      
      res.json({
        success: true,
        message: 'Plan de ahorros actualizado exitosamente',
        data: savingsPlan
      });
    } catch (error) {
      next(error);
    }
  }

  async getMemberStatistics(req, res, next) {
    try {
      const statistics = await memberService.getMemberStatistics();
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }

  // Fixed Savings endpoints
  async createFixedSaving(req, res, next) {
    try {
      const { id } = req.params;
      const fixedSavingData = req.body;
      
      const fixedSaving = await fixedSavingService.createFixedSaving(id, fixedSavingData);
      
      res.status(201).json({
        success: true,
        message: 'Plan de ahorro a plazo fijo creado exitosamente',
        data: fixedSaving
      });
    } catch (error) {
      next(error);
    }
  }

  async getMemberFixedSavings(req, res, next) {
    try {
      const { id } = req.params;
      const filters = req.query;
      
      const fixedSavings = await fixedSavingService.getFixedSavingsByMember(id, filters);
      
      res.json({
        success: true,
        data: fixedSavings
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MemberController();