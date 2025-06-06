'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear miembros de ejemplo
    const members = await queryInterface.bulkInsert('members', [
      {
        name: 'Juan Pérez García',
        dni: '12345678',
        shares: 15,
        guarantee: 8000.00,
        credit_score: 78,
        credit_rating: 'green',
        phone: '+51987654321',
        email: 'juan.perez@email.com',
        address: 'Av. Principal 123, Lima',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'María Elena Rodriguez',
        dni: '87654321',
        shares: 20,
        guarantee: 12000.00,
        credit_score: 85,
        credit_rating: 'green',
        phone: '+51912345678',
        email: 'maria.rodriguez@email.com',
        address: 'Jr. Los Olivos 456, Lima',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Carlos Alberto Mendoza',
        dni: '11223344',
        shares: 8,
        guarantee: 4500.00,
        credit_score: 45,
        credit_rating: 'yellow',
        phone: '+51998877665',
        email: 'carlos.mendoza@email.com',
        address: 'Av. El Sol 789, Lima',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Ana Sofía Vargas',
        dni: '55667788',
        shares: 12,
        guarantee: 6800.00,
        credit_score: 65,
        credit_rating: 'yellow',
        phone: '+51955443322',
        email: 'ana.vargas@email.com',
        address: 'Calle Las Flores 321, Lima',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Roberto Silva Torres',
        dni: '99887766',
        shares: 5,
        guarantee: 2500.00,
        credit_score: 25,
        credit_rating: 'red',
        phone: '+51911223344',
        email: 'roberto.silva@email.com',
        address: 'Pasaje Los Rosales 654, Lima',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: true });

    // Crear usuarios de ejemplo
    const passwordHash = await bcrypt.hash('123456', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password_hash: passwordHash,
        role: 'admin',
        name: 'Administrador Sistema',
        member_id: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'juan.perez',
        password_hash: passwordHash,
        role: 'member',
        name: 'Juan Pérez García',
        member_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'maria.rodriguez',
        password_hash: passwordHash,
        role: 'member',
        name: 'María Elena Rodriguez',
        member_id: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Crear configuraciones del sistema
    await queryInterface.bulkInsert('settings', [
      {
        key: 'loan.max_amount',
        value: '50000',
        description: 'Monto máximo de préstamo',
        category: 'loans',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'loan.min_amount',
        value: '1000',
        description: 'Monto mínimo de préstamo',
        category: 'loans',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'loan.default_interest_rate',
        value: '2.5',
        description: 'Tasa de interés mensual por defecto (%)',
        category: 'loans',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'loan.max_weeks',
        value: '52',
        description: 'Máximo número de semanas para préstamos',
        category: 'loans',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        key: 'system.share_value',
        value: '100',
        description: 'Valor de cada acción en soles',
        category: 'general',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Crear planes de ahorro de ejemplo
    await queryInterface.bulkInsert('savings_plans', [
      {
        member_id: 1,
        current_shares: 15,
        target_shares: 25,
        monthly_contribution: 500.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        member_id: 2,
        current_shares: 20,
        target_shares: 35,
        monthly_contribution: 800.00,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('savings_plans', null, {});
    await queryInterface.bulkDelete('settings', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('members', null, {});
  }
};