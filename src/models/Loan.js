module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'member_id'
    },
    loanRequestId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'loan_request_id'
    },
    originalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'original_amount'
    },
    remainingAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'remaining_amount'
    },
    monthlyInterestRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'monthly_interest_rate'
    },
    weeklyPayment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'weekly_payment'
    },
    totalWeeks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'total_weeks'
    },
    currentWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'current_week'
    },
    status: {
      type: DataTypes.ENUM('current', 'overdue', 'paid', 'cancelled'),
      allowNull: false,
      defaultValue: 'current'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date'
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'due_date'
    },
    approvedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'approved_by'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'loans',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['member_id'] },
      { fields: ['status'] },
      { fields: ['start_date'] },
      { fields: ['due_date'] }
    ]
  });

  Loan.associate = (models) => {
    Loan.belongsTo(models.Member, {
      foreignKey: 'memberId',
      as: 'member'
    });
    
    Loan.belongsTo(models.LoanRequest, {
      foreignKey: 'loanRequestId',
      as: 'loanRequest'
    });
    
    Loan.hasMany(models.Payment, {
      foreignKey: 'loanId',
      as: 'payments'
    });
  };

  return Loan;
};