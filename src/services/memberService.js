const { Member, Loan, LoanRequest, SavingsPlan, User } = require('../models');
const { Op } = require('sequelize');
const { getPaginationParams, createPaginatedResponse, getCreditRating, calculatePaymentCapacity } = require('../utils/helpers');

class MemberService {
  async createMember(memberData) {
    const { name, dni, shares = 0, guarantee = 0, creditScore = 50, phone, email, address } = memberData;

    // Verificar que el DNI no exista
    const existingMember = await Member.findOne({ where: { dni } });
    if (existingMember) {
      throw new Error('Ya existe un miembro con este DNI');
    }

    // Determinar calificación crediticia
    const creditRating = getCreditRating(creditScore);

    // Crear miembro
    const member = await Member.create({
      name,
      dni,
      shares,
      guarantee,
      creditScore,
      creditRating,
      phone,
      email,
      address
    });

    return member;
  }

  async getMemberById(id) {
    const member = await Member.findByPk(id, {
      include: [
        {
          model: Loan,
          as: 'loans',
          where: { status: { [Op.ne]: 'cancelled' } },
          required: false,
          order: [['createdAt', 'DESC']]
        },
        {
          model: LoanRequest,
          as: 'loanRequests',
          required: false,
          order: [['requestDate', 'DESC']],
          limit: 5
        },
        {
          model: SavingsPlan,
          as: 'savingsPlan',
          required: false
        },
        {
          model: User,
          as: 'user',
          required: false,
          attributes: ['id', 'username', 'isActive']
        }
      ]
    });

    if (!member) {
      throw new Error('Miembro no encontrado');
    }

    // Calcular capacidad de pago
    const existingLoansAmount = member.loans
      ?.filter(loan => ['current', 'overdue'].includes(loan.status))
      ?.reduce((sum, loan) => sum + parseFloat(loan.remainingAmount), 0) || 0;

    const paymentCapacity = calculatePaymentCapacity(
      member.shares,
      member.guarantee,
      existingLoansAmount
    );

    return {
      ...member.toJSON(),
      paymentCapacity
    };
  }

  async getMembers(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      creditRating,
      isActive,
      minShares,
      maxShares,
      minCreditScore,
      maxCreditScore,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = filters;

    const { offset, limit: limitNum } = getPaginationParams(page, limit);

    // Construir condiciones WHERE
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { dni: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (creditRating !== undefined) {
      whereConditions.creditRating = creditRating;
    }

    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    if (minShares !== undefined) {
      whereConditions.shares = { [Op.gte]: minShares };
    }

    if (maxShares !== undefined) {
      whereConditions.shares = {
        ...whereConditions.shares,
        [Op.lte]: maxShares
      };
    }

    if (minCreditScore !== undefined) {
      whereConditions.creditScore = { [Op.gte]: minCreditScore };
    }

    if (maxCreditScore !== undefined) {
      whereConditions.creditScore = {
        ...whereConditions.creditScore,
        [Op.lte]: maxCreditScore
      };
    }

    // Ejecutar consulta
    const { rows: members, count: totalCount } = await Member.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: SavingsPlan,
          as: 'savingsPlan',
          required: false
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: limitNum,
      offset,
      distinct: true
    });

    return createPaginatedResponse(members, totalCount, page, limitNum);
  }

  async updateMember(id, updateData) {
    const member = await Member.findByPk(id);
    if (!member) {
      throw new Error('Miembro no encontrado');
    }

    // Si se actualiza el DNI, verificar unicidad
    if (updateData.dni && updateData.dni !== member.dni) {
      const existingMember = await Member.findOne({ 
        where: { dni: updateData.dni, id: { [Op.ne]: id } }
      });
      if (existingMember) {
        throw new Error('Ya existe un miembro con este DNI');
      }
    }

    // Si se actualiza el creditScore, recalcular creditRating
    if (updateData.creditScore !== undefined) {
      updateData.creditRating = getCreditRating(updateData.creditScore);
    }

    await member.update(updateData);

    return this.getMemberById(id);
  }

  async deleteMember(id) {
    const member = await Member.findByPk(id, {
      include: [
        { model: Loan, as: 'loans' },
        { model: User, as: 'user' }
      ]
    });

    if (!member) {
      throw new Error('Miembro no encontrado');
    }

    // Verificar que no tenga préstamos activos
    const activeLoans = member.loans?.filter(loan => 
      ['current', 'overdue'].includes(loan.status)
    );

    if (activeLoans && activeLoans.length > 0) {
      throw new Error('No se puede eliminar un miembro con préstamos activos');
    }

    // Si tiene usuario asociado, desactivarlo
    if (member.user) {
      await member.user.update({ isActive: false, memberId: null });
    }

    // Marcar como inactivo en lugar de eliminar
    await member.update({ isActive: false });

    return { message: 'Miembro desactivado correctamente' };
  }

  async updateSavingsPlan(memberId, planData) {
    const member = await Member.findByPk(memberId);
    if (!member) {
      throw new Error('Miembro no encontrado');
    }

    const { targetShares, monthlyContribution, isActive = true } = planData;

    // Buscar plan existente o crear uno nuevo
    let savingsPlan = await SavingsPlan.findOne({ where: { memberId } });

    if (savingsPlan) {
      await savingsPlan.update({
        targetShares,
        monthlyContribution,
        isActive
      });
    } else {
      savingsPlan = await SavingsPlan.create({
        memberId,
        currentShares: member.shares,
        targetShares,
        monthlyContribution,
        isActive
      });
    }

    return savingsPlan;
  }

  async getMemberStatistics() {
    const totalMembers = await Member.count({ where: { isActive: true } });
    
    const membersByRating = await Member.findAll({
      attributes: [
        'creditRating',
        [Member.sequelize.fn('COUNT', '*'), 'count']
      ],
      where: { isActive: true },
      group: ['creditRating']
    });

    const totalShares = await Member.sum('shares', { where: { isActive: true } });
    const totalGuarantee = await Member.sum('guarantee', { where: { isActive: true } });

    const avgCreditScore = await Member.findOne({
      attributes: [
        [Member.sequelize.fn('AVG', Member.sequelize.col('creditScore')), 'avgScore']
      ],
      where: { isActive: true }
    });

    return {
      totalMembers,
      membersByRating: membersByRating.reduce((acc, item) => {
        acc[item.creditRating] = parseInt(item.getDataValue('count'));
        return acc;
      }, {}),
      totalShares: totalShares || 0,
      totalGuarantee: totalGuarantee || 0,
      averageCreditScore: Math.round(avgCreditScore?.getDataValue('avgScore') || 0)
    };
  }
}

module.exports = new MemberService();