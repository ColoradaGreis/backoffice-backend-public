const axios = require('axios')
const CONTENT_TYPE = 'application/json'

module.exports = {
  list: async (accessToken, eans) => {
    const SECTION = '/products?' + (eans ? '&eans=' + eans : '')
    const URL = process.env.SERVICE_PROVIDER_URL + SECTION
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
      console.log(response)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  getProduct: async (accessToken, payload) => {
    const SECTION = '/products'
    const URL = process.env.SERVICE_PROVIDER_URL + SECTION + '/' + payload
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
  },
  updatePrice: async (accessToken, storeId, payload) => {
    const SECTION = '/products'
    const URL = process.env.SERVICE_PROVIDER_URL + SECTION + '/' + storeId
    try {
      const config = {
        headers: {
          accept: CONTENT_TYPE,
          'content-type': 'application/json',
          authorization: 'Bearer ' + accessToken,
          'cache-control': 'no-cache'
        }
      }
      const response = await axios.patch(URL, payload, config)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
