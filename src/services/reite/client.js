const axios = require('axios')
const CONTENT_TYPE = 'application/json'

module.exports = {
  list: async (accessToken, startDate, endDate, payload) => {
    console.log(payload, 'PAYLOAD LOCO')
    const SECTION = 'users'
    const limit = payload.limit || 10
    const pageParameter = payload.page || 1
    const withTransactions = payload.withTransactions || true
    const URL = process.env.SERVICE_PROVIDER_CLIENT_URL + SECTION + `?startAt=${startDate}&endAt=${endDate}&limit=${limit}&pageParameter=${pageParameter}&withTransactions=${withTransactions}`
    console.log(URL, 'URL')
    try {
      const config = {
        headers: {
          accept: CONTENT_TYPE,
          'content-type': 'application/json',
          authorization: 'Bearer ' + accessToken,
          'cache-control': 'no-cache'
        }
      }
      const response = await axios.get(URL, config)
      console.log(response.data, 'RESPONSE')

      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  get: async (accessToken, userId) => {
    // console.log('viendo qué manda el accessToken', accessToken)
    const SECTION = 'user'
    const URL = process.env.SERVICE_PROVIDER_CLIENT_URL + SECTION + '?userId=' + userId
    try {
      const config = {
        headers: {
          accept: CONTENT_TYPE,
          'content-type': 'application/json',
          authorization: 'Bearer ' + accessToken,
          'cache-control': 'no-cache'
        }
      }
      const response = await axios.get(URL, config)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
