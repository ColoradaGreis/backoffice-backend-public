/* eslint-disable */
const axios = require('axios')
const CONTENT_TYPE = 'application/json'
const NodeCache = require('node-cache')
const tokenCache = new NodeCache()

module.exports = {
  auth: async () => {
    const SECTION = '/token/auth'
    const URL = process.env.SERVICE_PROVIDER_URL_TWO + SECTION
    try {
      if (tokenCache.get('serviceAuth')) {
        return tokenCache.get('serviceAuth')
      }
      const msg = {
        email: process.env.SERVICE_EMAIL,
        password: process.env.SERVICE_PASSWORD
      }
      const config = {
        headers: {
          accept: CONTENT_TYPE,
          'content-type': 'application/json',
          'cache-control': 'no-cache'
        }
      }
      // const response = await axios.post(URL, msg, config)
      const response = URL + '_mock_access_token'
      // console.log(response)
      tokenCache.set('serviceAuth', response.data, 3000)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
