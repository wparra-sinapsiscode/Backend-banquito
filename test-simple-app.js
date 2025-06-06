require('dotenv').config();
const express = require('express');

const app = express();
const PORT = 3002; // Puerto diferente para no conflictar

// Middleware básico
app.use(express.json());

// Ruta de prueba simple
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Test app funcionando',
    timestamp: new Date().toISOString()
  });
});

// Ruta health simple
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Health check OK'
  });
});

// Ruta login simple
app.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login test endpoint',
    body: req.body
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📍 Test: http://localhost:${PORT}/`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});

module.exports = app;