const { getRedisClient } = require('../services/redis/redisConfig')
const models = require('../database')
module.exports = {
  savePrices: async (storeId, layoutId, prices) => {
    const redisKey = `prices:${storeId}:${layoutId}`
    console.log('redisKey', redisKey)
    if (process.env.REDIS_ENABLED === 'true') {
      const redisClient = getRedisClient()
      await redisClient.set(redisKey, JSON.stringify(prices))
    } else {
      await models.redis.create({ redisKey, prices })
    }
    return { storeId, prices }
  },
  getPrices: async (storeId, layoutId) => {
    const redisKey = `prices:${storeId}:${layoutId}`
    if (process.env.REDIS_ENABLED === 'true') {
      const redisClient = getRedisClient()
      const response = await redisClient.get(redisKey)
      return JSON.parse(response)
    } else {
      const response = await models.redis.findOne({ where: { redisKey } })
      return response.prices
    }
  },
  deletePrices: async (redisKey) => {
    if (process.env.REDIS_ENABLED === 'true') {
      const redisClient = getRedisClient()
      await redisClient.del(redisKey)
    } else {
      const redis = await models.redis.findOne({ where: { redisKey } })
      if (redis) {
        await models.redis.destroy({ where: { redisKey } })
      } else {
        return { message: 'Prices not found' }
      }
    }
    return { message: 'Prices deleted' }
  }
}
