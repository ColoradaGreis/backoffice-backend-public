const { validationResult } = require('express-validator')
const quantityManager = require('../../core/quantityManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await quantityManager.getByProductId(req.params)
  if (result) {
    return res.json(result)
  }

  return res.status(400).json({ error: 'error' })
}
// /**
//  * @openapi
//  * /quantity-threshold/product/{productId}:
//  *   get:
//  *     tags: [quantity-threshold]
//  *     description: Obtener umbral de cantidad por ID de producto.
//  *     parameters:
//  *       - in: path
//  *         name: productId
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del producto para el cual se desea obtener el umbral de cantidad.
//  *     responses:
//  *       '200':
//  *         description: Umbral de cantidad del producto recuperado exitosamente.
//  *         content:
//  *           application/json:
//  *             example:
//  *               productId: 123
//  *               minimum_stock_level: 100
//  *       '400':
//  *         description: No se pudo obtener el umbral de cantidad del producto.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'error'
//  *       '422':
//  *         description: Error de validación al obtener el umbral de cantidad del producto.
//  *         content:
//  *           application/json:
//  *             example:
//  *               errors: [{ param: "productId", msg: "El ID del producto debe ser numérico", value: "invalid_productId" }]
//  *       '500':
//  *         description: Error interno del servidor al intentar obtener el umbral de cantidad del producto.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor al intentar obtener el umbral de cantidad del producto.'
//  */
