require('dotenv').config();
const express = require('express');

console.log('🚀 Starting debug server...');

const app = express();
const PORT = process.env.PORT || 3001;

// Solo middlewares básicos
app.use(express.json());

console.log('📍 Adding root route...');
// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root route hit');
  res.json({
    success: true,
    message: 'Debug server funcionando',
    version: '1.0.0'
  });
});

console.log('📍 Adding health route...');
// Health route
app.get('/health', (req, res) => {
  console.log('✅ Health route hit');
  res.json({
    success: true,
    message: 'Health OK'
  });
});

console.log('📍 Adding API routes...');
// Intentar cargar routes
try {
  const routes = require('./src/routes');
  app.use('/api/v1', routes);
  console.log('✅ API routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Debug middleware
app.use((req, res, next) => {
  console.log(`📍 Request: ${req.method} ${req.url}`);
  next();
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: "Ruta no encontrada DEBUG"
  });
});

console.log('🔧 Starting server...');
app.listen(PORT, () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
  console.log(`📍 Test: http://localhost:${PORT}/`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});

module.exports = app;