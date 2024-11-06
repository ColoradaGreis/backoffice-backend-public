const axios = require('axios')
const CONTENT_TYPE = 'application/json'

module.exports = {
  list: async (accessToken) => {
    const SECTION = '/transactions'
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
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  get: async (accessToken, id) => {
    const SECTION = '/transactions/' + id
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
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  update: async (accessToken, transactionId, purchased, restocked) => {
    const SECTION = '/transactions/' + transactionId + '/results'
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
      const body = {
        purchased,
        restocked,
        alwaysUpdateInventory: true
      }
      const response = await axios.patch(URL, body, config)
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  getList: async (accessToken, limit, startTimestamp, endTimestamp) => {
    console.log(limit, startTimestamp, endTimestamp, 'limit, startTimestamp, endTimestamp')
    const SECTION = '/transactions'
    const URL = process.env.SERVICE_PROVIDER_URL + SECTION + '?limit=' + limit + '&openStoreType=RESTOCK' + '&startTimestamp=' + startTimestamp + '&endTimestamp=' + endTimestamp
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
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
