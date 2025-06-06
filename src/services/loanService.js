const { Loan, LoanRequest, Member, Payment } = require('../models');
const { Op } = require('sequelize');
const { 
  getPaginationParams, 
  createPaginatedResponse, 
  calculateWeeklyPayment, 
  calculateDueDate,
  calculateWeeksElapsed,
  formatDate 
} = require('../utils/helpers');

class LoanService {
  async createLoan(loanData) {
    const { 
      memberId, 
      loanRequestId, 
      originalAmount, 
      monthlyInterestRate, 
      totalWeeks, 
      startDate, 
      notes 
    } = loanData;

    // Verificar que el miembro existe
    const member = await Member.findByPk(memberId);
    if (!member) {
      throw new Error('Miembro no encontrado');
    }

    // Verificar capacidad de pago
    const existingLoans = await Loan.findAll({
      where: { 
        memberId, 
        status: { [Op.in]: ['current', 'overdue'] }
      }
    });

    const existingDebt = existingLoans.reduce((sum, loan) => 
      sum + parseFloat(loan.remainingAmount), 0
    );

    const shareValue = 100; // Valor por acción
    const maxLoanCapacity = (member.shares * shareValue + parseFloat(member.guarantee)) * 0.5;

    if (existingDebt + parseFloat(originalAmount) > maxLoanCapacity) {
      throw new Error('El monto solicitado excede la capacidad de pago del miembro');
    }

    // Calcular pago semanal
    const weeklyPayment = calculateWeeklyPayment(originalAmount, monthlyInterestRate, totalWeeks);

    // Calcular fecha de vencimiento
    const dueDate = calculateDueDate(startDate, totalWeeks);

    // Crear préstamo
    const loan = await Loan.create({
      memberId,
      loanRequestId,
      originalAmount,
      remainingAmount: originalAmount,
      monthlyInterestRate,
      weeklyPayment,
      totalWeeks,
      currentWeek: 0,
      startDate,
      dueDate,
      notes
    });

    // Si viene de una solicitud, marcarla como aprobada
    if (loanRequestId) {
      await LoanRequest.update(
        { status: 'approved' },
        { where: { id: loanRequestId } }
      );
    }

    return this.getLoanById(loan.id);
  }

  async getLoanById(id) {
    const loan = await Loan.findByPk(id, {
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'name', 'dni', 'creditRating']
        },
        {
          model: LoanRequest,
          as: 'loanRequest',
          required: false
        },
        {
          model: Payment,
          as: 'payments',
          order: [['paymentDate', 'DESC']]
        }
      ]
    });

    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    // Calcular información adicional
    const weeksElapsed = calculateWeeksElapsed(loan.startDate);
    const isOverdue = weeksElapsed > loan.currentWeek && loan.status === 'current';
    
    return {
      ...loan.toJSON(),
      weeksElapsed,
      isOverdue,
      paymentsCount: loan.payments?.length || 0
    };
  }

  async getLoans(filters = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      memberId,
      status,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'createdAt',
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

    if (startDate) {
      whereConditions.startDate = { [Op.gte]: startDate };
    }

    if (endDate) {
      whereConditions.startDate = {
        ...whereConditions.startDate,
        [Op.lte]: endDate
      };
    }

    if (minAmount) {
      whereConditions.originalAmount = { [Op.gte]: minAmount };
    }

    if (maxAmount) {
      whereConditions.originalAmount = {
        ...whereConditions.originalAmount,
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

    const { rows: loans, count: totalCount } = await Loan.findAndCountAll({
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

    return createPaginatedResponse(loans, totalCount, page, limitNum);
  }

  async updateLoan(id, updateData) {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    // No permitir actualizar préstamos pagados o cancelados
    if (['paid', 'cancelled'].includes(loan.status)) {
      throw new Error('No se puede actualizar un préstamo pagado o cancelado');
    }

    await loan.update(updateData);
    return this.getLoanById(id);
  }

  async createPayment(loanId, paymentData) {
    const { amount, weekNumber, lateFee = 0, notes, paymentDate } = paymentData;

    const loan = await Loan.findByPk(loanId, {
      include: [{ model: Member, as: 'member' }]
    });

    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    if (loan.status !== 'current' && loan.status !== 'overdue') {
      throw new Error('No se pueden registrar pagos para este préstamo');
    }

    // Verificar que no exista ya un pago para esta semana
    const existingPayment = await Payment.findOne({
      where: { loanId, weekNumber }
    });

    if (existingPayment) {
      throw new Error('Ya existe un pago registrado para esta semana');
    }

    // Crear el pago
    const payment = await Payment.create({
      loanId,
      amount,
      weekNumber,
      lateFee,
      notes,
      paymentDate: paymentDate || new Date(),
      createdBy: 'system' // Aquí se debería usar el usuario que registra el pago
    });

    // Actualizar el préstamo
    const newRemainingAmount = parseFloat(loan.remainingAmount) - parseFloat(amount);
    const newCurrentWeek = Math.max(loan.currentWeek, weekNumber);

    let newStatus = loan.status;
    if (newRemainingAmount <= 0) {
      newStatus = 'paid';
    } else {
      const weeksElapsed = calculateWeeksElapsed(loan.startDate);
      newStatus = weeksElapsed > newCurrentWeek ? 'overdue' : 'current';
    }

    await loan.update({
      remainingAmount: Math.max(0, newRemainingAmount),
      currentWeek: newCurrentWeek,
      status: newStatus
    });

    return payment;
  }

  async getLoanPayments(loanId) {
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    const payments = await Payment.findAll({
      where: { loanId },
      order: [['paymentDate', 'DESC']]
    });

    return payments;
  }

  async getLoanSchedule(loanId, includePayments = false) {
    const loan = await Loan.findByPk(loanId, {
      include: includePayments ? [{ model: Payment, as: 'payments' }] : undefined
    });

    if (!loan) {
      throw new Error('Préstamo no encontrado');
    }

    const schedule = [];
    const startDate = new Date(loan.startDate);

    for (let week = 1; week <= loan.totalWeeks; week++) {
      const dueDate = new Date(startDate);
      dueDate.setDate(startDate.getDate() + (week - 1) * 7);

      const payment = includePayments ? 
        loan.payments?.find(p => p.weekNumber === week) : null;

      schedule.push({
        weekNumber: week,
        dueDate: formatDate(dueDate),
        expectedAmount: loan.weeklyPayment,
        payment: payment ? {
          id: payment.id,
          amount: payment.amount,
          paymentDate: payment.paymentDate,
          lateFee: payment.lateFee,
          notes: payment.notes
        } : null,
        status: payment ? 'paid' : 
                week <= loan.currentWeek ? 'pending' : 'upcoming'
      });
    }

    return {
      loan: {
        id: loan.id,
        originalAmount: loan.originalAmount,
        remainingAmount: loan.remainingAmount,
        weeklyPayment: loan.weeklyPayment,
        totalWeeks: loan.totalWeeks,
        currentWeek: loan.currentWeek,
        status: loan.status
      },
      schedule
    };
  }

  async getLoanStatistics() {
    const totalLoans = await Loan.count();
    
    const loansByStatus = await Loan.findAll({
      attributes: [
        'status',
        [Loan.sequelize.fn('COUNT', '*'), 'count'],
        [Loan.sequelize.fn('SUM', Loan.sequelize.col('originalAmount')), 'totalAmount']
      ],
      group: ['status']
    });

    const activeLoansAmount = await Loan.sum('remainingAmount', {
      where: { status: { [Op.in]: ['current', 'overdue'] } }
    });

    const overdueLoans = await Loan.count({
      where: { status: 'overdue' }
    });

    return {
      totalLoans,
      loansByStatus: loansByStatus.reduce((acc, item) => {
        acc[item.status] = {
          count: parseInt(item.getDataValue('count')),
          totalAmount: parseFloat(item.getDataValue('totalAmount')) || 0
        };
        return acc;
      }, {}),
      activeLoansAmount: activeLoansAmount || 0,
      overdueLoans
    };
  }

  async getOverdueLoans() {
    const overdueLoans = await Loan.findAll({
      where: { status: 'overdue' },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['id', 'name', 'dni', 'phone', 'email']
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    return overdueLoans.map(loan => ({
      ...loan.toJSON(),
      weeksOverdue: calculateWeeksElapsed(loan.dueDate)
    }));
  }
}

module.exports = new LoanService();