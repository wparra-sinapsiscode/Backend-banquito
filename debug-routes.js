const express = require('express');

// Test si routes se puede cargar
console.log('🔍 Testing route imports...');

try {
  const routes = require('./src/routes/index.js');
  console.log('✅ Routes index imported successfully');
  console.log('Routes type:', typeof routes);
  
  // Test individual route files
  const authRoutes = require('./src/routes/authRoutes.js');
  console.log('✅ Auth routes imported successfully');
  
  const memberRoutes = require('./src/routes/memberRoutes.js');
  console.log('✅ Member routes imported successfully');
  
  const loanRoutes = require('./src/routes/loanRoutes.js');
  console.log('✅ Loan routes imported successfully');
  
  const loanRequestRoutes = require('./src/routes/loanRequestRoutes.js');
  console.log('✅ Loan request routes imported successfully');
  
  // Create test app
  const app = express();
  app.use('/api/v1', routes);
  
  // Test root route
  app.get('/', (req, res) => {
    res.json({ message: 'Root works' });
  });
  
  // List all routes
  console.log('\n📋 Registered routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      console.log(`Router mounted at: ${middleware.regexp.source}`);
      if (middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach((layer) => {
          if (layer.route) {
            console.log(`  ${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`);
          }
        });
      }
    }
  });
  
} catch (error) {
  console.error('❌ Error importing routes:', error.message);
  console.error('Stack:', error.stack);
}