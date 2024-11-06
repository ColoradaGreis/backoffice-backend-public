// https://buybye.reckon.ai/api-docs/api/bo/
const axios = require('axios')
const PROVIDER_URL = ''
const CONTENT_TYPE = 'application/json'

module.exports = {
  create: async (accessToken) => {
    const SECTION = '/products'
    const URL = PROVIDER_URL + SECTION
    try {
      const msg = {}
      const config = {
        headers: {
          accept: CONTENT_TYPE,
          'content-type': 'application/json',
          authorization: 'ApiKey ' + accessToken,
          'cache-control': 'no-cache'
        }
      }
      const response = await axios.post(URL, msg, config)
      console.log(response)
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
