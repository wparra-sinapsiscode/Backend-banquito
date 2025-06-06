const axios = require('axios');

async function testServer() {
  try {
    console.log('🔍 Probando conectividad del servidor...');
    
    // Probar la ruta raíz
    console.log('📍 Probando ruta raíz (/)...');
    const rootResponse = await axios.get('http://localhost:3001/');
    console.log('✅ Ruta raíz funciona!');
    console.log('📋 Response:', JSON.stringify(rootResponse.data, null, 2));
    
    // Probar ruta que no existe
    console.log('\n📍 Probando ruta inexistente...');
    try {
      await axios.get('http://localhost:3001/ruta-que-no-existe');
    } catch (error) {
      console.log('✅ Error 404 esperado para ruta inexistente');
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error de conectividad:');
    if (error.code === 'ECONNREFUSED') {
      console.error('🔴 El servidor no está corriendo en el puerto 3001');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testServer();