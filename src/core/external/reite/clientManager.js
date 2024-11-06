const reiteToken = require('../../../services/reite/token')
const reiteClient = require('../../../services/reite/client')
const dayjs = require('dayjs')

module.exports = {
  list: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    const startDate = dayjs.utc(payload.startTimestamp).valueOf() / 1000
    const finalDate = dayjs.utc(payload.endTimestamp).endOf('day').valueOf() / 1000
    const endDate = Math.floor(finalDate)

    return reiteClient.list(accessToken, startDate, endDate, payload)
  },
  get: async (id) => {
    const { accessToken } = await reiteToken.auth()
    return reiteClient.get(accessToken, id)
  }
}
