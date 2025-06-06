const { FixedSaving, Member } = require('../models');
const { Op } = require('sequelize');

class FixedSavingService {
  async createFixedSaving(memberId, fixedSavingData) {
    try {
      // Validar que el miembro existe
      const member = await Member.findByPk(memberId);
      if (!member) {
        throw new Error('Miembro no encontrado');
      }

      // Calcular fecha de vencimiento si no se proporciona
      const startDate = new Date(fixedSavingData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + fixedSavingData.termDays);

      // Calcular monto al vencimiento
      const annualRate = fixedSavingData.annualRate / 100;
      const dailyRate = annualRate / 365;
      const maturityAmount = fixedSavingData.amount * (1 + (dailyRate * fixedSavingData.termDays));

      const fixedSaving = await FixedSaving.create({
        memberId,
        amount: fixedSavingData.amount,
        termDays: fixedSavingData.termDays,
        annualRate: fixedSavingData.annualRate,
        startDate: startDate,
        endDate: endDate,
        maturityAmount: Math.round(maturityAmount * 100) / 100,
        status: 'active',
        notes: fixedSavingData.notes || null
      });

      return await this.getFixedSavingById(fixedSaving.id);
    } catch (error) {
      throw new Error(`Error creating fixed saving: ${error.message}`);
    }
  }

  async getFixedSavingById(id) {
    try {
      const fixedSaving = await FixedSaving.findByPk(id, {
        include: [{
          model: Member,
          as: 'member',
          attributes: ['id', 'name', 'dni']
        }]
      });

      if (!fixedSaving) {
        throw new Error('Plan de ahorro no encontrado');
      }

      return fixedSaving;
    } catch (error) {
      throw new Error(`Error fetching fixed saving: ${error.message}`);
    }
  }

  async getFixedSavingsByMember(memberId, filters = {}) {
    try {
      const whereClause = { memberId };
      
      if (filters.status) {
        whereClause.status = filters.status;
      }

      const fixedSavings = await FixedSaving.findAll({
        where: whereClause,
        include: [{
          model: Member,
          as: 'member',
          attributes: ['id', 'name', 'dni']
        }],
        order: [['createdAt', 'DESC']]
      });

      return fixedSavings;
    } catch (error) {
      throw new Error(`Error fetching member fixed savings: ${error.message}`);
    }
  }

  async getAllFixedSavings(filters = {}) {
    try {
      const whereClause = {};
      
      if (filters.status) {
        whereClause.status = filters.status;
      }
      
      if (filters.memberId) {
        whereClause.memberId = filters.memberId;
      }

      const fixedSavings = await FixedSaving.findAll({
        where: whereClause,
        include: [{
          model: Member,
          as: 'member',
          attributes: ['id', 'name', 'dni']
        }],
        order: [['createdAt', 'DESC']]
      });

      return fixedSavings;
    } catch (error) {
      throw new Error(`Error fetching fixed savings: ${error.message}`);
    }
  }

  async updateFixedSaving(id, updateData) {
    try {
      const fixedSaving = await FixedSaving.findByPk(id);
      if (!fixedSaving) {
        throw new Error('Plan de ahorro no encontrado');
      }

      // Solo permitir actualizar ciertos campos
      const allowedFields = ['status', 'notes'];
      const filteredData = {};
      
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      await fixedSaving.update(filteredData);
      return await this.getFixedSavingById(id);
    } catch (error) {
      throw new Error(`Error updating fixed saving: ${error.message}`);
    }
  }

  async cancelFixedSaving(id) {
    try {
      const fixedSaving = await FixedSaving.findByPk(id);
      if (!fixedSaving) {
        throw new Error('Plan de ahorro no encontrado');
      }

      if (fixedSaving.status !== 'active') {
        throw new Error('Solo se pueden cancelar planes de ahorro activos');
      }

      await fixedSaving.update({ status: 'cancelled' });
      return await this.getFixedSavingById(id);
    } catch (error) {
      throw new Error(`Error cancelling fixed saving: ${error.message}`);
    }
  }

  async matureFixedSaving(id) {
    try {
      const fixedSaving = await FixedSaving.findByPk(id);
      if (!fixedSaving) {
        throw new Error('Plan de ahorro no encontrado');
      }

      if (fixedSaving.status !== 'active') {
        throw new Error('Solo se pueden madurar planes de ahorro activos');
      }

      const today = new Date();
      if (today < new Date(fixedSaving.endDate)) {
        throw new Error('El plan de ahorro aún no ha vencido');
      }

      await fixedSaving.update({ status: 'matured' });
      return await this.getFixedSavingById(id);
    } catch (error) {
      throw new Error(`Error maturing fixed saving: ${error.message}`);
    }
  }

  async getFixedSavingsStatistics() {
    try {
      const stats = await FixedSaving.findAll({
        attributes: [
          'status',
          [FixedSaving.sequelize.fn('COUNT', FixedSaving.sequelize.col('id')), 'count'],
          [FixedSaving.sequelize.fn('SUM', FixedSaving.sequelize.col('amount')), 'totalAmount'],
          [FixedSaving.sequelize.fn('SUM', FixedSaving.sequelize.col('maturityAmount')), 'totalMaturityAmount']
        ],
        group: ['status'],
        raw: true
      });

      const totalStats = await FixedSaving.findOne({
        attributes: [
          [FixedSaving.sequelize.fn('COUNT', FixedSaving.sequelize.col('id')), 'totalCount'],
          [FixedSaving.sequelize.fn('SUM', FixedSaving.sequelize.col('amount')), 'totalInvested'],
          [FixedSaving.sequelize.fn('SUM', FixedSaving.sequelize.col('maturityAmount')), 'totalMaturity']
        ],
        raw: true
      });

      return {
        byStatus: stats,
        totals: totalStats
      };
    } catch (error) {
      throw new Error(`Error fetching fixed savings statistics: ${error.message}`);
    }
  }
}

module.exports = new FixedSavingService();