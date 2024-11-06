const env = process.env.NODE_ENV || 'development'
const port = process.env.NODE_PORT || 3500
require('dotenv').config({ path: `./.env.${env}` })

const { initializeRedis } = require('./src/services/redis/redisConfig')

global.__basepath = __dirname
global.APP_TIMEZONE = 'America/Santiago'
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(global.APP_TIMEZONE)
dayjs.locale('es')

global.FILE_SIZE_LIMIT = 10 // in MB
global.PRODUCT_CATEGORY_LIST = [
  'desayuno',
  'latam',
  'liquidos',
  'mascotas',
  'miscelaneo',
  'picoteo',
  'preparados',
  'snack'
]
global.INVENTORY_STATUS = [
  { status_id: 0, label: 'initialized', default_name: 'initialized' },
  { status_id: 1, label: 'Validación', default_name: 'validated' },
  { status_id: 2.0, label: 'En preparación', default_name: 'prepared' },
  { status_id: 3.0, label: 'En camino', default_name: 'shipped' },
  { status_id: 4.0, label: 'Entregado', default_name: 'delivered' }
]
global.SHOW_PRODUCT_NAMES = true
global.FILE_TIMESTAMP_FORMAT = 'DD_MM_YYYY'
// const schedules = require('./src/schedules')
// const models = require('./src/database')
// const slackApp = require('./src/services/slack/app.js')
const app = require('./src/routes/api');
// const scripts = require('./custom_scripts');
// require('./src/scraping/skuToVitex.js');

(async () => {
  await initializeRedis()

  app.listen(port, () => {
    console.log(`ENV: ${env}`)
    console.log(`Port: ${port}`)
  })
})()

// load basic scripts
// scripts.load()
// require('./src/tests/testLayoutControl.js')
// require('./src/tests/testCompareLayouts.js')
// require('./src/tests/testGetProductByInternalId.js')
