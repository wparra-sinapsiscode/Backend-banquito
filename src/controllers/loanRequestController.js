const loanRequestService = require('../services/loanRequestService');

class LoanRequestController {
  async createLoanRequest(req, res, next) {
    try {
      const requestData = req.body;
      
      const loanRequest = await loanRequestService.createLoanRequest(requestData);
      
      res.status(201).json({
        success: true,
        message: 'Solicitud de préstamo creada exitosamente',
        data: loanRequest
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanRequestById(req, res, next) {
    try {
      const { id } = req.params;
      
      const loanRequest = await loanRequestService.getLoanRequestById(id);
      
      res.json({
        success: true,
        data: loanRequest
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanRequests(req, res, next) {
    try {
      const filters = req.query;
      
      const result = await loanRequestService.getLoanRequests(filters);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLoanRequest(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const reviewedBy = req.user.name;
      
      const loanRequest = await loanRequestService.updateLoanRequest(id, updateData, reviewedBy);
      
      res.json({
        success: true,
        message: 'Solicitud actualizada exitosamente',
        data: loanRequest
      });
    } catch (error) {
      next(error);
    }
  }

  async approveLoanRequest(req, res, next) {
    try {
      const { id } = req.params;
      const approvalData = req.body;
      const approvedBy = req.user.name;
      
      const result = await loanRequestService.approveLoanRequest(id, approvalData, approvedBy);
      
      res.json({
        success: true,
        message: 'Solicitud aprobada y préstamo creado exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectLoanRequest(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const reviewedBy = req.user.name;
      
      const loanRequest = await loanRequestService.rejectLoanRequest(id, reason, reviewedBy);
      
      res.json({
        success: true,
        message: 'Solicitud rechazada exitosamente',
        data: loanRequest
      });
    } catch (error) {
      next(error);
    }
  }

  async getLoanRequestStatistics(req, res, next) {
    try {
      const statistics = await loanRequestService.getLoanRequestStatistics();
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const pendingRequests = await loanRequestService.getPendingRequests();
      
      res.json({
        success: true,
        data: pendingRequests
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LoanRequestController();