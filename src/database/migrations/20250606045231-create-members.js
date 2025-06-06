'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      dni: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      shares: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      guarantee: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      credit_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50
      },
      credit_rating: {
        type: Sequelize.ENUM('green', 'yellow', 'red'),
        allowNull: false,
        defaultValue: 'yellow'
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('members', ['dni']);
    await queryInterface.addIndex('members', ['credit_rating']);
    await queryInterface.addIndex('members', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('members');
  }
};
