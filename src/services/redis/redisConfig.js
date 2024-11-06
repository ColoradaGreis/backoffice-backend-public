const redis = require('redis')

let redisClient = null

const initializeRedis = async () => {
  if (process.env.REDIS_ENABLED === 'true') {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    })

    redisClient.on('error', (err) => {
      console.error('Redis error:', err)
    })

    redisClient.on('connect', () => {
      console.log('Redis: enabled')
    })

    try {
      await redisClient.connect()
    } catch (err) {
      console.error('Error connecting to Redis:', err)
    }
  } else {
    console.log('Redis: disabled')
  }
}
const getRedisClient = () => {
  if (process.env.REDIS_ENABLED === 'true') {
    if (!redisClient) {
      console.error('Redis client is not initialized')
      throw new Error('Redis client is not initialized')
    }
    return redisClient
  }
}

module.exports = {
  initializeRedis,
  getRedisClient
}
