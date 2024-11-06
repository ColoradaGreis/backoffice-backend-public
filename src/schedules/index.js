const CronJob = require('cron').CronJob
const storeManager = require('../core/external/reite/storeManager')
const slack = require('../services/slack')
const moment = require('moment-timezone')

// const job =
// '*/10 * * * * *',

new CronJob('0 0 9 * * 1-5', async function () {
  console.log('cron review CNV_005')
  const alert = await getStockAlert('CNV_005')
  await slack.sendArrayTemplate('reite', alert)
},
null,
true,
global.APP_TIMEZONE
)

new CronJob('0 0 9 * * 1-5', async function () {
  console.log('cron review CNV_003')
  const alert = await getStockAlert('CNV_003')
  await slack.sendArrayTemplate('reite', alert)
},
null,
true,
global.APP_TIMEZONE
)

new CronJob('0 0 9 * * 1-5', async function () {
  console.log('cron review CNV_002')
  const alert = await getStockAlert('CNV_002')
  await slack.sendArrayTemplate('reite', alert)
},
null,
true,
global.APP_TIMEZONE
)

async function getStockAlert (storeId) {
  const filterLimit = 3
  const response = await storeManager.getStock({ storeId, limit: filterLimit })
  const alertMsg = {
    title: ':file_cabinet: ' + response.name + ' ' + '(' + response.storeId + ') - ' + moment().format('DD/MM/YYYY - HH:mm:ss'),
    subtitle: '(revisando productos con stock inferior a ' + filterLimit + ')'
  }
  if (response.stock.length > 0) {
    alertMsg.body = response.stock
  } else {
    alertMsg.body = 'No existen productos con unidades inferiores a : ' + filterLimit + ' o el MVP esta funcionando mal :C'
  }
  return alertMsg
}
