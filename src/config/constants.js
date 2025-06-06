module.exports = {
  ROLES: {
    ADMIN: 'admin',
    MEMBER: 'member',
    EXTERNAL: 'external'
  },
  
  CREDIT_RATINGS: {
    GREEN: 'green',
    YELLOW: 'yellow', 
    RED: 'red'
  },
  
  LOAN_STATUS: {
    CURRENT: 'current',
    OVERDUE: 'overdue',
    PAID: 'paid',
    CANCELLED: 'cancelled'
  },
  
  LOAN_REQUEST_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },
  
  SETTINGS_CATEGORIES: {
    GENERAL: 'general',
    LOANS: 'loans',
    PAYMENTS: 'payments',
    NOTIFICATIONS: 'notifications'
  },
  
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },
  
  BCRYPT_SALT_ROUNDS: 12,
  
  DEFAULT_SETTINGS: {
    'loan.max_amount': '50000',
    'loan.min_amount': '1000',
    'loan.default_interest_rate': '2.5',
    'loan.max_weeks': '52',
    'loan.late_fee_percentage': '5',
    'system.share_value': '100',
    'system.min_guarantee_ratio': '2'
  }
};