const winston = require('winston')
const axios = require('axios')
const Transport = require('winston-transport')
const {
  getDataDogApiKey,
  getApplicationName,
  getLogHostName,
  getEnv,
  getEnableLogs
} = require('./getEnvConfig')

const DATADOG_API_KEY = getDataDogApiKey()
const APPLICATION_NAME = getApplicationName()
const LOG_HOST_NAME = getLogHostName()
const ENV = getEnv()
const ENABLE_LOGS = getEnableLogs()
const PATH = `/api/v2/logs?dd-api-key=${DATADOG_API_KEY}&ddsource=nodejs&service=${APPLICATION_NAME}`

const httpTransportOptions = {
  host: 'https://http-intake.logs.datadoghq.com',
  path: PATH,
  ssl: true,
  hostname: LOG_HOST_NAME,
  service: APPLICATION_NAME,
  ddsource: 'nodejs',
  ddtags: `env:${ENV}`
}

const { combine, timestamp, json, errors, printf, colorize } = winston.format
const errorsFormat = errors({ stack: true })
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })
)

const datadogTransporter = async (payload) => {
  if (ENABLE_LOGS === false) {
    return
  }

  const { level, message, timestamp, metadata, sendLog } = payload
  const messageDate = `[${APPLICATION_NAME}]${message}[${new Date().toISOString()}]`

  if (sendLog || level === 'error' || level === 'warn') {
    const data = [
      {
        level,
        message: messageDate,
        service: httpTransportOptions.service,
        metadata,
        ddsource: httpTransportOptions.ddsource,
        ddtags: httpTransportOptions.ddtags,
        timestamp
      }
    ]

    return axios
      .post(
                `${httpTransportOptions.host}${httpTransportOptions.path}`,
                data,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
      )
      .then((response) => {
        console.log('Response on transport success')
      })
      .catch((error) => {
        console.log('Error on transport', error)
      })
  }
}

class CustomTransport extends Transport {
  log (payload, cb) {
    // Call datadog messages
    datadogTransporter(payload)
    cb(null)
  }
}

const logger = winston.createLogger({
  level: 'info',
  exitOnError: false,
  format: json(),
  transports: [
    new winston.transports.Console({
      format: consoleFormat // Usa el formato personalizado aquí
    }),
    // Mantén la configuración de Datadog como está
    new CustomTransport({
      format: combine(timestamp(), json(), errorsFormat)
    })
  ]
})

module.exports = { logger }
