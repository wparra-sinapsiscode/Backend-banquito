module.exports = (sequelize, DataTypes) => {
  const SavingsPlan = sequelize.define('SavingsPlan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'member_id'
    },
    currentShares: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'current_shares',
      validate: {
        min: 0
      }
    },
    targetShares: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'target_shares',
      validate: {
        min: 1
      }
    },
    monthlyContribution: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'monthly_contribution',
      validate: {
        min: 0
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'savings_plans',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['member_id'] },
      { fields: ['is_active'] }
    ]
  });

  SavingsPlan.associate = (models) => {
    SavingsPlan.belongsTo(models.Member, {
      foreignKey: 'memberId',
      as: 'member'
    });
  };

  return SavingsPlan;
};