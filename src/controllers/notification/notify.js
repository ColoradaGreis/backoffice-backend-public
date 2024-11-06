const { validationResult } = require('express-validator')
const notificationManager = require('../../core/notificationManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await notificationManager.notify(req.body)
  if (result) {
    return res.json(result)
  }
}
