const bcrypt = require('bcryptjs');
const { User } = require('./src/models');

async function testLogin() {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...');
    
    // Buscar todos los usuarios
    const users = await User.findAll({
      attributes: ['id', 'username', 'passwordHash', 'role', 'isActive']
    });

    console.log('\n👥 Usuarios encontrados:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}, Active: ${user.isActive}`);
    });

    // Probar password del admin
    console.log('\n🔐 Probando contraseña del admin...');
    const adminUser = users.find(u => u.username === 'admin');
    
    if (adminUser) {
      const testPassword = '123456';
      const isValid = await bcrypt.compare(testPassword, adminUser.passwordHash);
      console.log(`  Password '${testPassword}' es válida: ${isValid}`);
      
      // Mostrar información del hash
      console.log(`  Hash almacenado: ${adminUser.passwordHash.substring(0, 20)}...`);
    } else {
      console.log('  ❌ Usuario admin no encontrado');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();