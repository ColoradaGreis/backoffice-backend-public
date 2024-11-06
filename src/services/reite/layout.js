const axios = require('axios')
const CONTENT_TYPE = 'application/json'
const { v4: uuidv4 } = require('uuid')

module.exports = {
  list: async (accessToken) => {
    const SECTION = '/layouts'
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
    const SECTION = '/layouts/' + id
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
  create: async (accessToken, body) => {
    const layoutId = uuidv4()
    const SECTION = '/layouts/' + layoutId
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

      const response = await axios.post(URL, body, config)
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  update: async (accessToken, id, body) => {
    const SECTION = '/layouts/' + id
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

      const response = await axios.put(URL, body, config)
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  delete: async (accessToken, id) => {
    const SECTION = '/layouts/' + id
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

      const response = await axios.delete(URL, config)
      // console.log(response);
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
