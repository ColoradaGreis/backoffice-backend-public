const express = require('express')
const router = express.Router()
const basicAuth = require('express-basic-auth')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backoffice API',
      description: 'API para la gestión de tiendas y productos. Esta API permite realizar diversas operaciones relacionadas con tiendas y productos.',
      version: '1.0.0',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'graciana.baratti@gmail.com'
      },
      license: {
        name: 'Licencia de Uso',
        url: ''
      }
    },
    externalDocs: {
      description: 'Descarga tu archivo Postman',
      url: ''
    },
    servers: [
      {
        url: '',
        description: 'Servidor de desarollo'
      },
      {
        url: '',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT' // O el formato que estés usando, como OAuth2
        }
      }
    },
    security: [
      {
        api_key: []
      }
    ]
  },
  apis: ['./src/controllers/*/*.js', './src/controllers/*/*/*.js', './src/controllers/*/*/*/*.js'] // archivos que contienen anotaciones como en el ejemplo anterior
})

router.use('/', swaggerUi.serve)

router.get('/', basicAuth({ users: { Alfajor: 'maicena' }, challenge: true }), swaggerUi.setup(swaggerSpec, { explorer: true }))

router.get('/postman', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', 'attachment; filename=swagger.json')
  res.send(swaggerSpec)
})

module.exports = router
