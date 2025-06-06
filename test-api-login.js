const axios = require('axios');

async function testAPI() {
  try {
    // Primero probar health check
    console.log('🩺 Probando health check...');
    const healthResponse = await axios.get('http://localhost:3001/api/v1/health');
    console.log('✅ Health check exitoso!');
    console.log('📋 Health Response:', JSON.stringify(healthResponse.data, null, 2));

    // Luego probar login
    console.log('\n🧪 Probando login via API...');
    const loginResponse = await axios.post('http://localhost:3001/api/v1/auth/login', {
      username: 'admin',
      password: '123456'
    });

    console.log('✅ Login exitoso!');
    console.log('📋 Login Response:', JSON.stringify(loginResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('URL:', error.config?.url);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAPI();