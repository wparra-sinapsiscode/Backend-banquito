require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const { sequelize } = require('./models');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de seguridad
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use(generalLimiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Debug middleware (antes del body parsing)
app.use((req, res, next) => {
  console.log(`📍 Request: ${req.method} ${req.url}`);
  console.log(`📍 Headers:`, req.headers);
  next();
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug body middleware
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`📍 Body:`, req.body);
    console.log(`📍 Body type:`, typeof req.body);
  }
  next();
});

// Swagger documentation
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Banquito API Documentation'
}));

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ Root route hit');
  res.json({
    success: true,
    message: 'Bienvenido a la API de Banquito',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    health: '/api/v1/health'
  });
});

// API routes
console.log('🔧 Registering API routes...');
app.use('/api/v1', routes);
console.log('✅ API routes registered');

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');

    // Sync database (only in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📚 Documentación disponible en: http://localhost:${PORT}/api/v1/docs`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n📋 Endpoints disponibles:`);
        console.log(`   POST /api/v1/auth/login`);
        console.log(`   GET  /api/v1/members`);
        console.log(`   GET  /api/v1/loans`);
        console.log(`   GET  /api/v1/loan-requests`);
      }
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;