const redisClientManager = require('../../core/redisClientManager')
const { validationResult } = require('express-validator')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const storeId = req.body.storeId
  const prices = req.body.prices
  const layoutId = req.body.layoutId

  const response = await redisClientManager.savePrices(storeId, layoutId, prices)
  console.log(response, 'response')
  if (response) {
    return res.json(response)
  }
  return res.status(400).json({ error: 'No se pudo guardar los precios.' })
}
