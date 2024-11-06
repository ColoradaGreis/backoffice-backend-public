const axios = require('axios')
const CONTENT_TYPE = 'application/json'
const { v4: uuidv4 } = require('uuid')

module.exports = {
  list: async (accessToken) => {
    const SECTION = '/stores'
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
    const SECTION = '/stores/' + id
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
  getInventory: async (accessToken, id) => {
    const SECTION = '/stores/' + id + '/inventory'
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
  getProducts: async (accessToken, id) => {
    // console.log(id, 'este es el id de SERVICE')
    const SECTION = '/stores/' + id + '/products'
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
  open: async (accessToken, id, userClientId, openStoreType) => {
    const SECTION = '/stores/' + id + '/open'
    const URL = process.env.SERVICE_PROVIDER_URL_TWO + SECTION

    const config = {
      headers: {
        accept: CONTENT_TYPE,
        'content-type': 'application/json',
        authorization: 'Bearer ' + accessToken,
        'cache-control': 'no-cache'
      }
    }
    const transactionId = uuidv4()
    // console.log(transactionId)
    const response = await axios.post(URL, { userClientId, openStoreType, transactionId }, config)
    // console.log(response);
    const result = { response: response.data, transactionId }
    return result
  },
  putInventory: async (accessToken, id, added, removed) => {
    const SECTION = '/stores/' + id + '/inventory'
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
      const response = await axios.put(URL, { added, removed }, config)
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error, '--------------------------------------')
      throw error
    }
  },
  updateLayout: async (accessToken, params, body) => {
    const SECTION = '/stores/' + params.storeId + '/layouts/' + params.layoutId
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
      const response = await axios.patch(URL, body, config)
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
