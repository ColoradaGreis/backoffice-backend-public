const dotenv = require('dotenv')
dotenv.config()

const ENV = process.env.NODE_ENV || 'development'

const getEnv = () => {
  return ENV
}

const getLogLevel = () => {
  return process.env.LOG_LEVEL || 'info'
}

const getDataDogAppKey = () => {
  return process.env.DATADOG_APP_KEY || ''
}

const getDataDogApiKey = () => {
  return process.env.DATADOG_API_KEY || ''
}

const getApplicationName = () => {
  return `${process.env.APPLICATION_NAME || ''}_${ENV}`
}

const getLogHostName = () => {
  if (ENV === 'production' || ENV === 'QA') {
    return `cloud_${ENV}`
  }

  if (ENV === 'development') {
    return `localhost_${ENV}`
  }

  return 'localhost'
}

const getEnableLogs = () => {
  return process.env.DATADOG_ENABLED_LOGS === 'true'
}

module.exports = {
  getEnv,
  getLogLevel,
  getDataDogAppKey,
  getDataDogApiKey,
  getApplicationName,
  getLogHostName,
  getEnableLogs
}
