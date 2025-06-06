const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Banquito API',
      version: '1.0.0',
      description: 'API para el Sistema Bancario Cooperativo Banquito',
      contact: {
        name: 'Soporte Técnico',
        email: 'soporte@banquito.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}/api/v1`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        Member: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            name: {
              type: 'string',
              example: 'Juan Pérez'
            },
            dni: {
              type: 'string',
              example: '12345678'
            },
            shares: {
              type: 'integer',
              example: 10
            },
            guarantee: {
              type: 'number',
              format: 'decimal',
              example: 5000.00
            },
            creditScore: {
              type: 'integer',
              example: 75
            },
            creditRating: {
              type: 'string',
              enum: ['green', 'yellow', 'red'],
              example: 'green'
            },
            phone: {
              type: 'string',
              example: '+51987654321'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@email.com'
            },
            address: {
              type: 'string',
              example: 'Av. Principal 123'
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        },
        Loan: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            memberId: {
              type: 'integer',
              example: 1
            },
            originalAmount: {
              type: 'number',
              format: 'decimal',
              example: 10000.00
            },
            remainingAmount: {
              type: 'number',
              format: 'decimal',
              example: 8500.00
            },
            monthlyInterestRate: {
              type: 'number',
              format: 'decimal',
              example: 2.5
            },
            weeklyPayment: {
              type: 'number',
              format: 'decimal',
              example: 250.00
            },
            totalWeeks: {
              type: 'integer',
              example: 40
            },
            currentWeek: {
              type: 'integer',
              example: 6
            },
            status: {
              type: 'string',
              enum: ['current', 'overdue', 'paid', 'cancelled'],
              example: 'current'
            },
            startDate: {
              type: 'string',
              format: 'date',
              example: '2024-01-15'
            },
            dueDate: {
              type: 'string',
              format: 'date',
              example: '2024-11-15'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Rutas donde están las definiciones de Swagger
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};