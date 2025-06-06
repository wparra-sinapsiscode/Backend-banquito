module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    role: {
      type: DataTypes.ENUM('admin', 'member', 'external'),
      allowNull: false,
      defaultValue: 'member'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'member_id'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['username'] },
      { fields: ['role'] },
      { fields: ['member_id'] }
    ]
  });

  User.associate = (models) => {
    User.belongsTo(models.Member, {
      foreignKey: 'memberId',
      as: 'member'
    });
  };

  return User;
};