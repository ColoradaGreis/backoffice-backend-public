const { validationResult } = require('express-validator')
const productManager = require('../../core/productManager')

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const result = await productManager.updateImage(req.body, req.file)
  if (result) {
    return res.json({ message: 'Image updated', successful: true })
  }
  return res.sendStatus(400)
}
