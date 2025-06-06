const { format, addWeeks, differenceInWeeks, parseISO } = require('date-fns');
const Decimal = require('decimal.js');

const helpers = {
  // Formatear fechas
  formatDate: (date, formatStr = 'yyyy-MM-dd') => {
    if (!date) return null;
    return format(new Date(date), formatStr);
  },

  // Calcular fecha de vencimiento basada en semanas
  calculateDueDate: (startDate, totalWeeks) => {
    return addWeeks(new Date(startDate), totalWeeks);
  },

  // Calcular semanas transcurridas
  calculateWeeksElapsed: (startDate, currentDate = new Date()) => {
    return differenceInWeeks(currentDate, new Date(startDate));
  },

  // Calcular pago semanal
  calculateWeeklyPayment: (amount, interestRate, weeks) => {
    const principal = new Decimal(amount);
    const rate = new Decimal(interestRate).div(100);
    const totalWeeks = new Decimal(weeks);
    
    // Pago = (Principal * (1 + tasa)) / semanas
    const totalAmount = principal.mul(rate.plus(1));
    return totalAmount.div(totalWeeks).toDecimalPlaces(2);
  },

  // Calcular monto total con interés
  calculateTotalAmount: (amount, interestRate) => {
    const principal = new Decimal(amount);
    const rate = new Decimal(interestRate).div(100);
    return principal.mul(rate.plus(1)).toDecimalPlaces(2);
  },

  // Determinar calificación crediticia basada en score
  getCreditRating: (creditScore) => {
    if (creditScore >= 70) return 'green';
    if (creditScore >= 40) return 'yellow';
    return 'red';
  },

  // Validar DNI (formato básico)
  isValidDNI: (dni) => {
    return /^\d{8,12}$/.test(dni);
  },

  // Validar email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Formatear monto como moneda
  formatCurrency: (amount, currency = 'PEN') => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Paginación
  getPaginationParams: (page = 1, limit = 10) => {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;
    
    return {
      offset,
      limit: limitNum,
      page: pageNum
    };
  },

  // Generar respuesta paginada
  createPaginatedResponse: (data, totalCount, page, limit) => {
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  },

  // Calcular capacidad de pago
  calculatePaymentCapacity: (shares, guarantee, existingLoans = 0) => {
    const shareValue = new Decimal(100); // Valor por acción
    const totalAssets = new Decimal(shares).mul(shareValue).plus(guarantee);
    const availableCapacity = totalAssets.minus(existingLoans);
    
    return {
      totalAssets: totalAssets.toNumber(),
      existingLoans,
      availableCapacity: Math.max(0, availableCapacity.toNumber()),
      maxLoanAmount: availableCapacity.div(2).toNumber() // 50% de capacidad disponible
    };
  },

  // Sanitizar datos de entrada
  sanitizeString: (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  },

  // Generar código único
  generateCode: (prefix = '', length = 6) => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 2 + length);
    return `${prefix}${timestamp}${random}`.toUpperCase();
  }
};

module.exports = helpers;