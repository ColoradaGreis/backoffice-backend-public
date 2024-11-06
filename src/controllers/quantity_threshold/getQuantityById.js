const { validationResult } = require('express-validator')
const quantityManager = require('../../core/quantityManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await quantityManager.getById(req.body)
  if (result) {
    return res.json(result)
  }

  return res.status(400).json({ error: 'error' })
}
// /**
//  * @openapi
//  * /quantity-threshold/create:
//  *   post:
//  *     tags: [quantity-threshold]
//  *     description: Crear un umbral de cantidad para un producto en una tienda.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               productId:
//  *                 type: integer
//  *               storeId:
//  *                 type: string
//  *               stockLevel:
//  *                 type: integer
//  *     responses:
//  *       '200':
//  *         description: Umbral de cantidad creado exitosamente.
//  *         content:
//  *           application/json:
//  *             example:
//  *               id: 1
//  *               store_id: "Tienda A"
//  *               minimum_stock_level: 100
//  *       '400':
//  *         description: No se pudo crear el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'error'
//  *       '422':
//  *         description: Error de validación al crear el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               errors: [{ param: 'storeId', msg: 'La longitud de la tienda debe estar entre 3 y 50 caracteres', value: 'invalid_storeId' }]
//  *       '500':
//  *         description: Error interno del servidor al intentar crear el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor al intentar crear el umbral de cantidad.'
//  */
