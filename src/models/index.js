const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

const db = {};

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Member = require('./Member')(sequelize, Sequelize.DataTypes);
const Loan = require('./Loan')(sequelize, Sequelize.DataTypes);
const LoanRequest = require('./LoanRequest')(sequelize, Sequelize.DataTypes);
const Payment = require('./Payment')(sequelize, Sequelize.DataTypes);
const SavingsPlan = require('./SavingsPlan')(sequelize, Sequelize.DataTypes);
const FixedSaving = require('./FixedSaving')(sequelize, Sequelize.DataTypes);
const Settings = require('./Settings')(sequelize, Sequelize.DataTypes);

// Add models to db object
db.User = User;
db.Member = Member;
db.Loan = Loan;
db.LoanRequest = LoanRequest;
db.Payment = Payment;
db.SavingsPlan = SavingsPlan;
db.FixedSaving = FixedSaving;
db.Settings = Settings;

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;