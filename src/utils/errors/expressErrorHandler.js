const { logger } = require('../../services/logger/winston.js')

module.exports = (err, req, res, next) => {
  const status = err.response ? err.response.status : 500
  const message = err.message || (err.errors && err.errors[0] && err.errors[0].message) || 'Error'
  const data = err.response ? err.response.data : (err.errors && err.errors[0]) || null
  const externalRequestDetails = err.config
    ? {
        method: err.config.method.toUpperCase(), // Método HTTP de la solicitud externa
        url: err.config.url // URL de la solicitud externa
      }
    : null

  // Prepara los metadatos para el registro, incluyendo la solicitud original y la externa si existe
  const metadata = {
    status,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body, // Asegúrate de excluir datos sensibles
      params: req.params,
      query: req.query,
      headers: req.headers, // Incluye los headers de la solicitud, excluyendo cualquier dato sensible
      clientIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    },
    externalRequest: externalRequestDetails, // Detalles de la solicitud externa, si aplica
    data,
    errorMessage: message // Mensaje de error
  }

  logger.error(message, { metadata })

  console.log(`Type of res: ${typeof res}`)
  console.log(`res.status exists: ${typeof res.status}`)
  console.log(`Response headers sent: ${res.headersSent}`)

  if (!res.headersSent) {
    res.status(status).send({
      error: true,
      message,
      externalRequestDetails,
      data
    })
  } else {
    next(err)
  }
}
