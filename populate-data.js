require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Member, User, Settings, SavingsPlan } = require('./src/models');

async function populateData() {
  try {
    console.log('🌱 Poblando base de datos con datos de prueba...');

    // Crear miembros
    const members = await Member.bulkCreate([
      {
        name: 'Juan Pérez García',
        dni: '12345678',
        shares: 15,
        guarantee: 8000.00,
        creditScore: 78,
        creditRating: 'green',
        phone: '+51987654321',
        email: 'juan.perez@email.com',
        address: 'Av. Principal 123, Lima',
        isActive: true
      },
      {
        name: 'María Elena Rodriguez',
        dni: '87654321',
        shares: 20,
        guarantee: 12000.00,
        creditScore: 85,
        creditRating: 'green',
        phone: '+51912345678',
        email: 'maria.rodriguez@email.com',
        address: 'Jr. Los Olivos 456, Lima',
        isActive: true
      },
      {
        name: 'Carlos Alberto Mendoza',
        dni: '11223344',
        shares: 8,
        guarantee: 4500.00,
        creditScore: 45,
        creditRating: 'yellow',
        phone: '+51998877665',
        email: 'carlos.mendoza@email.com',
        address: 'Av. El Sol 789, Lima',
        isActive: true
      },
      {
        name: 'Ana Sofía Vargas',
        dni: '55667788',
        shares: 12,
        guarantee: 6800.00,
        creditScore: 65,
        creditRating: 'yellow',
        phone: '+51955443322',
        email: 'ana.vargas@email.com',
        address: 'Calle Las Flores 321, Lima',
        isActive: true
      },
      {
        name: 'Roberto Silva Torres',
        dni: '99887766',
        shares: 5,
        guarantee: 2500.00,
        creditScore: 25,
        creditRating: 'red',
        phone: '+51911223344',
        email: 'roberto.silva@email.com',
        address: 'Pasaje Los Rosales 654, Lima',
        isActive: true
      }
    ]);

    console.log('✅ Miembros creados:', members.length);

    // Crear usuarios
    const passwordHash = await bcrypt.hash('123456', 12);
    
    const users = await User.bulkCreate([
      {
        username: 'admin',
        passwordHash: passwordHash,
        role: 'admin',
        name: 'Administrador Sistema',
        memberId: null,
        isActive: true
      },
      {
        username: 'juan.perez',
        passwordHash: passwordHash,
        role: 'member',
        name: 'Juan Pérez García',
        memberId: members[0].id,
        isActive: true
      },
      {
        username: 'maria.rodriguez',
        passwordHash: passwordHash,
        role: 'member',
        name: 'María Elena Rodriguez',
        memberId: members[1].id,
        isActive: true
      }
    ]);

    console.log('✅ Usuarios creados:', users.length);

    // Crear configuraciones del sistema
    const settings = await Settings.bulkCreate([
      {
        key: 'loan.max_amount',
        value: '50000',
        description: 'Monto máximo de préstamo',
        category: 'loans'
      },
      {
        key: 'loan.min_amount',
        value: '1000',
        description: 'Monto mínimo de préstamo',
        category: 'loans'
      },
      {
        key: 'loan.default_interest_rate',
        value: '2.5',
        description: 'Tasa de interés mensual por defecto (%)',
        category: 'loans'
      },
      {
        key: 'loan.max_weeks',
        value: '52',
        description: 'Máximo número de semanas para préstamos',
        category: 'loans'
      },
      {
        key: 'system.share_value',
        value: '100',
        description: 'Valor de cada acción en soles',
        category: 'general'
      }
    ]);

    console.log('✅ Configuraciones creadas:', settings.length);

    // Crear planes de ahorro
    const savingsPlans = await SavingsPlan.bulkCreate([
      {
        memberId: members[0].id,
        currentShares: 15,
        targetShares: 25,
        monthlyContribution: 500.00,
        isActive: true
      },
      {
        memberId: members[1].id,
        currentShares: 20,
        targetShares: 35,
        monthlyContribution: 800.00,
        isActive: true
      }
    ]);

    console.log('✅ Planes de ahorro creados:', savingsPlans.length);

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📋 Datos creados:');
    console.log(`   👥 ${members.length} miembros`);
    console.log(`   🔐 ${users.length} usuarios`);
    console.log(`   ⚙️  ${settings.length} configuraciones`);
    console.log(`   💰 ${savingsPlans.length} planes de ahorro`);
    
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Admin: admin / 123456');
    console.log('   Usuario: juan.perez / 123456');
    console.log('   Usuario: maria.rodriguez / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
}

populateData();