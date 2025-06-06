const loanService = require('../services/loanService');

class LoanController {
  async createLoan(req, res, next) {
    try {
      const loanData = req.body;
      
      const loan = await loanService.createLoan(loanData);
      
      res.status(201).json({
        success: true,
        message: 'Préstamo creado exitosamente',
        data: loan
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanById(req, res, next) {
    try {
      const { id } = req.params;
      
      const loan = await loanService.getLoanById(id);
      
      res.json({
        success: true,
        data: loan
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoans(req, res, next) {
    try {
      const filters = req.query;
      
      const result = await loanService.getLoans(filters);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLoan(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const loan = await loanService.updateLoan(id, updateData);
      
      res.json({
        success: true,
        message: 'Préstamo actualizado exitosamente',
        data: loan
      });
    } catch (error) {
      next(error);
    }
  }

  async createPayment(req, res, next) {
    try {
      const { id } = req.params;
      const paymentData = req.body;
      
      const payment = await loanService.createPayment(id, paymentData);
      
      res.status(201).json({
        success: true,
        message: 'Pago registrado exitosamente',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanPayments(req, res, next) {
    try {
      const { id } = req.params;
      
      const payments = await loanService.getLoanPayments(id);
      
      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanSchedule(req, res, next) {
    try {
      const { id } = req.params;
      const { includePayments } = req.query;
      
      const schedule = await loanService.getLoanSchedule(id, includePayments === 'true');
      
      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanStatistics(req, res, next) {
    try {
      const statistics = await loanService.getLoanStatistics();
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }

  async getOverdueLoans(req, res, next) {
    try {
      const overdueLoans = await loanService.getOverdueLoans();
      
      res.json({
        success: true,
        data: overdueLoans
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LoanController();