const express = require('express');
const authRoutes = require('./authRoutes');
const memberRoutes = require('./memberRoutes');
const loanRoutes = require('./loanRoutes');
const loanRequestRoutes = require('./loanRequestRoutes');
const settingsRoutes = require('./settingsRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/members', memberRoutes);
router.use('/loans', loanRoutes);
router.use('/loan-requests', loanRequestRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;