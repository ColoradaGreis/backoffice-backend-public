const reiteToken = require('../../../services/reite/token')
const reiteTransaction = require('../../../services/reite/transaction')
const dayjs = require('dayjs')

module.exports = {
  list: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteTransaction.list(accessToken)
  },
  get: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteTransaction.get(accessToken, payload.transactionId)
  },
  update: async (transactionId, purchased, restocked) => {
    const { accessToken } = await reiteToken.auth()
    return reiteTransaction.update(accessToken, transactionId, purchased, restocked)
  },
  getList: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    const dateStart = dayjs.utc(payload.startTimestamp).valueOf() / 1000
    const endDate = dayjs.utc(payload.endTimestamp).endOf('day').valueOf() / 1000
    const dateEnd = Math.floor(endDate)

    return reiteTransaction.getList(accessToken, payload.limit, dateStart, dateEnd)
  }
}
