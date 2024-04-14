const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Fitness Coaching Platform API',
      version: '1.0.0', 
      description: 'API documentation for a fitness coaching platform',  
    },
    servers: [
      { url: 'http://localhost:3111' }, 
    ],
  },
  apis: ['./backend/controllers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
