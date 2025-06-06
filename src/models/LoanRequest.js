module.exports = (sequelize, DataTypes) => {
  const LoanRequest = sequelize.define('LoanRequest', {
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
    requestedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'requested_amount'
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'request_date'
    },
    reviewedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reviewed_by'
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'review_date'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'loan_requests',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['member_id'] },
      { fields: ['status'] },
      { fields: ['request_date'] }
    ]
  });

  LoanRequest.associate = (models) => {
    LoanRequest.belongsTo(models.Member, {
      foreignKey: 'memberId',
      as: 'member'
    });
    
    LoanRequest.hasOne(models.Loan, {
      foreignKey: 'loanRequestId',
      as: 'loan'
    });
  };

  return LoanRequest;
};