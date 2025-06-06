module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    guarantee: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    creditScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
      field: 'credit_score',
      validate: {
        min: 1,
        max: 90
      }
    },
    creditRating: {
      type: DataTypes.ENUM('green', 'yellow', 'red'),
      allowNull: false,
      defaultValue: 'yellow',
      field: 'credit_rating'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'members',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['dni'] },
      { fields: ['credit_rating'] },
      { fields: ['is_active'] }
    ]
  });

  Member.associate = (models) => {
    Member.hasMany(models.Loan, {
      foreignKey: 'memberId',
      as: 'loans'
    });
    
    Member.hasMany(models.LoanRequest, {
      foreignKey: 'memberId',
      as: 'loanRequests'
    });
    
    Member.hasOne(models.SavingsPlan, {
      foreignKey: 'memberId',
      as: 'savingsPlan'
    });
    
    Member.hasMany(models.FixedSaving, {
      foreignKey: 'memberId',
      as: 'fixedSavings'
    });
    
    Member.hasOne(models.User, {
      foreignKey: 'memberId',
      as: 'user'
    });
  };

  return Member;
};