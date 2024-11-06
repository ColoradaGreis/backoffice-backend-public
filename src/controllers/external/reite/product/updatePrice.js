const { validationResult } = require('express-validator')
const productManager = require('../../../../core/external/reite/productManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await productManager.updatePrice(req.params.productId, req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/products/:productId:
 *   patch:
 *     tags: [Reite Products]
 *     description: Actualizar precio de un producto de Reite por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *           minLength: 5
 *         description: ID del producto a actualizar.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *                 minLength: 1
 *               name:
 *                 type: string
 *                 minLength: 1
 *               storeId:
 *                 type: string
 *                 minLength: 1
 *               price:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Producto de Reite actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               noMatchProducts: [{ id: 'ABC123', name: 'Producto A' }, { id: 'XYZ789', name: 'Producto X' }]
 *               matchedProducts: [{ id: '123DEF', name: 'Producto 123' }, { id: '456GHI', name: 'Producto 456' }]
 *       '400':
 *         description: No se pudo actualizar el producto de Reite.
 *         content:
 *           application/json:
 *             example:
 *               error: 'error'
 *       '500':
 *         description: Error interno del servidor al intentar actualizar el producto de Reite.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
