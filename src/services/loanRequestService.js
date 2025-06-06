const { LoanRequest, Member, Loan } = require('../models');
const { Op } = require('sequelize');
const { getPaginationParams, createPaginatedResponse } = require('../utils/helpers');
const loanService = require('./loanService');

class LoanRequestService {
  async createLoanRequest(requestData) {
    const { memberId, requestedAmount, purpose } = requestData;

    // Verificar que el miembro existe
    const member = await Member.findByPk(memberId);
    if (!member) {
      throw new Error('Miembro no encontrado');
    }

    // Verificar que el miembro esté activo
    if (!member.isActive) {
      throw new Error('El miembro no está activo');
    }

    // Verificar que no tenga una solicitud pendiente
    const pendingRequest = await LoanRequest.findOne({
      where: { 
        memberId, 
        status: 'pending' 
      }
    });

    if (pendingRequest) {
      throw new Error('El miembro ya tiene una solicitud pendiente');
    }

    // Crear la solicitud
    const loanRequest = await LoanRequest.create({
      memberId,
      requestedAmount,
      purpose,
      status: 'pending',
      requestDate: new Date()
    });

    return this.getLoanRequestById(loanRequest.id);
  }

  async getLoanRequestById(id) {
    const loanRequest = await LoanRequest.findByPk(id, {
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'name', 'dni', 'shares', 'guarantee', 'creditScore', 'creditRating']
        },
        {
          model: Loan,
          as: 'loan',
          required: false
        }
      ]
    });

    if (!loanRequest) {
      throw new Error('Solicitud de préstamo no encontrada');
    }

    // Calcular capacidad de pago si el miembro existe
    let paymentCapacity = null;
    if (loanRequest.member) {
      const existingLoans = await Loan.findAll({
        where: { 
          memberId: loanRequest.memberId,
          status: { [Op.in]: ['current', 'overdue'] }
        }
      });

      const existingDebt = existingLoans.reduce((sum, loan) => 
        sum + parseFloat(loan.remainingAmount), 0
      );

      const shareValue = 100;
      const totalAssets = loanRequest.member.shares * shareValue + parseFloat(loanRequest.member.guarantee);
      const maxLoanCapacity = totalAssets * 0.5;
      const availableCapacity = maxLoanCapacity - existingDebt;

      paymentCapacity = {
        totalAssets,
        existingDebt,
        maxLoanCapacity,
        availableCapacity,
        requestedAmount: parseFloat(loanRequest.requestedAmount),
        canApprove: parseFloat(loanRequest.requestedAmount) <= availableCapacity
      };
    }

    return {
      ...loanRequest.toJSON(),
      paymentCapacity
    };
  }

  async getLoanRequests(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      memberId,
      status,
      requestDate,
      minAmount,
      maxAmount,
      sortBy = 'requestDate',
      sortOrder = 'DESC'
    } = filters;

    const { offset, limit: limitNum } = getPaginationParams(page, limit);

    // Construir condiciones WHERE
    const whereConditions = {};

    if (memberId) {
      whereConditions.memberId = memberId;
    }

    if (status) {
      whereConditions.status = status;
    }

    if (requestDate) {
      whereConditions.requestDate = { [Op.gte]: requestDate };
    }

    if (minAmount) {
      whereConditions.requestedAmount = { [Op.gte]: minAmount };
    }

    if (maxAmount) {
      whereConditions.requestedAmount = {
        ...whereConditions.requestedAmount,
        [Op.lte]: maxAmount
      };
    }

    // Construir condiciones de búsqueda en miembro
    const memberWhere = {};
    if (search) {
      memberWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { dni: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows: requests, count: totalCount } = await LoanRequest.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'name', 'dni', 'creditRating'],
          where: Object.keys(memberWhere).length > 0 ? memberWhere : undefined
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: limitNum,
      offset,
      distinct: true
    });

    return createPaginatedResponse(requests, totalCount, page, limitNum);
  }

  async updateLoanRequest(id, updateData, reviewedBy) {
    const { status, notes } = updateData;

    const loanRequest = await LoanRequest.findByPk(id);
    if (!loanRequest) {
      throw new Error('Solicitud de préstamo no encontrada');
    }

    // Solo se pueden actualizar solicitudes pendientes
    if (loanRequest.status !== 'pending') {
      throw new Error('Solo se pueden actualizar solicitudes pendientes');
    }

    // Actualizar la solicitud
    await loanRequest.update({
      status,
      notes,
      reviewedBy,
      reviewDate: new Date()
    });

    return this.getLoanRequestById(id);
  }

  async approveLoanRequest(id, approvalData, approvedBy) {
    const { monthlyInterestRate, totalWeeks, notes } = approvalData;

    const loanRequest = await LoanRequest.findByPk(id, {
      include: [{ model: Member, as: 'member' }]
    });

    if (!loanRequest) {
      throw new Error('Solicitud de préstamo no encontrada');
    }

    if (loanRequest.status !== 'pending') {
      throw new Error('Solo se pueden aprobar solicitudes pendientes');
    }

    // Verificar capacidad de pago
    const existingLoans = await Loan.findAll({
      where: { 
        memberId: loanRequest.memberId,
        status: { [Op.in]: ['current', 'overdue'] }
      }
    });

    const existingDebt = existingLoans.reduce((sum, loan) => 
      sum + parseFloat(loan.remainingAmount), 0
    );

    const shareValue = 100;
    const maxLoanCapacity = (loanRequest.member.shares * shareValue + parseFloat(loanRequest.member.guarantee)) * 0.5;

    if (existingDebt + parseFloat(loanRequest.requestedAmount) > maxLoanCapacity) {
      throw new Error('El monto solicitado excede la capacidad de pago del miembro');
    }

    // Crear el préstamo
    const loanData = {
      memberId: loanRequest.memberId,
      loanRequestId: loanRequest.id,
      originalAmount: loanRequest.requestedAmount,
      monthlyInterestRate,
      totalWeeks,
      startDate: new Date(),
      notes: notes || `Aprobado desde solicitud #${loanRequest.id}`
    };

    const loan = await loanService.createLoan(loanData);

    // Actualizar la solicitud
    await loanRequest.update({
      status: 'approved',
      reviewedBy: approvedBy,
      reviewDate: new Date(),
      notes
    });

    return {
      loanRequest: await this.getLoanRequestById(id),
      loan
    };
  }

  async rejectLoanRequest(id, reason, reviewedBy) {
    const loanRequest = await LoanRequest.findByPk(id);
    if (!loanRequest) {
      throw new Error('Solicitud de préstamo no encontrada');
    }

    if (loanRequest.status !== 'pending') {
      throw new Error('Solo se pueden rechazar solicitudes pendientes');
    }

    await loanRequest.update({
      status: 'rejected',
      notes: reason,
      reviewedBy,
      reviewDate: new Date()
    });

    return this.getLoanRequestById(id);
  }

  async getLoanRequestStatistics() {
    const totalRequests = await LoanRequest.count();
    
    const requestsByStatus = await LoanRequest.findAll({
      attributes: [
        'status',
        [LoanRequest.sequelize.fn('COUNT', '*'), 'count'],
        [LoanRequest.sequelize.fn('SUM', LoanRequest.sequelize.col('requestedAmount')), 'totalAmount']
      ],
      group: ['status']
    });

    const pendingRequests = await LoanRequest.count({
      where: { status: 'pending' }
    });

    const avgRequestAmount = await LoanRequest.findOne({
      attributes: [
        [LoanRequest.sequelize.fn('AVG', LoanRequest.sequelize.col('requestedAmount')), 'avgAmount']
      ]
    });

    return {
      totalRequests,
      requestsByStatus: requestsByStatus.reduce((acc, item) => {
        acc[item.status] = {
          count: parseInt(item.getDataValue('count')),
          totalAmount: parseFloat(item.getDataValue('totalAmount')) || 0
        };
        return acc;
      }, {}),
      pendingRequests,
      averageRequestAmount: parseFloat(avgRequestAmount?.getDataValue('avgAmount')) || 0
    };
  }

  async getPendingRequests() {
    return await LoanRequest.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'name', 'dni', 'creditScore', 'creditRating']
        }
      ],
      order: [['requestDate', 'ASC']]
    });
  }
}

module.exports = new LoanRequestService();