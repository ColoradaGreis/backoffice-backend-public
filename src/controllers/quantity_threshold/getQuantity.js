const { validationResult } = require('express-validator')
const quantityManager = require('../../core/quantityManager')
module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await quantityManager.list()
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

// /**
//  * @openapi
//  * /quantity-threshold:
//  *   get:
//  *     tags: [quantity-threshold]
//  *     description: Obtener información sobre el umbral de cantidad.
//  *     responses:
//  *       '200':
//  *         description: Información sobre el umbral de cantidad recuperada con éxito.
//  *         content:
//  *           application/json:
//  *             example:
//  *               id: 100
//  *               store_id: CNV_005
//  *               minimum_stock_level: 6
//  *       '500':
//  *         description: Error interno del servidor al intentar obtener la información sobre el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor al intentar obtener la información sobre el umbral de cantidad.'
//  */
