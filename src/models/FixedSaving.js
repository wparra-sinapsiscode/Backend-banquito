module.exports = (sequelize, DataTypes) => {
  const FixedSaving = sequelize.define('FixedSaving', {
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
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    termDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'term_days',
      validate: {
        min: 30
      }
    },
    annualRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 2.00,
      field: 'annual_rate'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'end_date'
    },
    maturityAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: 'maturity_amount'
    },
    status: {
      type: DataTypes.ENUM('active', 'matured', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'fixed_savings',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['member_id'] },
      { fields: ['status'] },
      { fields: ['start_date'] },
      { fields: ['end_date'] }
    ]
  });

  FixedSaving.associate = (models) => {
    FixedSaving.belongsTo(models.Member, {
      foreignKey: 'memberId',
      as: 'member'
    });
  };

  return FixedSaving;
};