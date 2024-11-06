const { validationResult } = require('express-validator')
const replenishmentOrderManager = require('../../core/replenishment/replenishmentOrderManager')

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const result = await replenishmentOrderManager.create(req.body)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}
