const reiteToken = require('../../../services/reite/token')
const reiteLayout = require('../../../services/reite/layout')

module.exports = {
  list: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteLayout.list(accessToken)
  },
  getLayout: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteLayout.get(accessToken, payload)
  },
  create: async (payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteLayout.create(accessToken, payload)
  },
  update: async (id, payload) => {
    const { accessToken } = await reiteToken.auth()
    return reiteLayout.update(accessToken, id, payload)
  },
  delete: async (id) => {
    const { accessToken } = await reiteToken.auth()
    return reiteLayout.delete(accessToken, id)
  }
}
