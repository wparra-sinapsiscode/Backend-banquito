module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    loanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'loan_id'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'payment_date'
    },
    weekNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'week_number'
    },
    lateFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      field: 'late_fee'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'created_by'
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['loan_id'] },
      { fields: ['payment_date'] },
      { fields: ['week_number'] }
    ]
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Loan, {
      foreignKey: 'loanId',
      as: 'loan'
    });
  };

  return Payment;
};