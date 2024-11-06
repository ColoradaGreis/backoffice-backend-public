const axios = require('axios')
const CONTENT_TYPE = 'application/json'
const dayjs = require('dayjs')

// &startTimestamp=1675220400&endTimestamp=1696129199

module.exports = {
  list: async (accessToken, params) => {
    const dateStart = dayjs.utc(params.startTimestamp).valueOf() / 1000
    const endDate = dayjs.utc(params.endTimestamp).endOf('day').valueOf() / 1000
    const dateEnd = Math.floor(endDate)

    const URL = `${process.env.SERVICE_PROVIDER_URL}/transactions?limit=100000&openStoreType=RESTOCK&startTimestamp=${dateStart}&endTimestamp=${dateEnd}`
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
// getTime()
// Devuelve el timestamp para una fecha determinada – cantidad de milisegundos transcurridos a partir del 1° de Enero de 1970 UTC+0.
