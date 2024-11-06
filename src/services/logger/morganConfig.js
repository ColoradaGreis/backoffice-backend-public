const morgan = require('morgan')
require('colors') // Asegúrate de tener esta librería si usas el coloreo en los logs

// Definir token personalizado
morgan.token('statusColor', (req, res) => {
  const status = res.statusCode
  if (status >= 500) return `${status}`.red
  if (status >= 400) return `${status}`.yellow
  if (status >= 300) return `${status}`.cyan
  return `${status}`.green
})

// Configurar y exportar middleware de Morgan
const morganMiddleware = morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.statusColor(req, res), // Usa el token personalizado para colorear el estado
  `${tokens['response-time'](req, res)} ms -`,
  tokens.res(req, res, 'content-length')
].join(' '))

module.exports = morganMiddleware
