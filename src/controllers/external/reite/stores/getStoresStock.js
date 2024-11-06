const { validationResult } = require('express-validator')
const storeManager = require('../../../../core/external/reite/storeManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await storeManager.getStock(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/stores/stock:
 *   get:
 *     tags: [Reite Store]
 *     description: Obtener el stock de productos en una tienda de Reite.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *           minLength: 5
 *         description: ID de la tienda de Reite.
 *         required: true
 *     responses:
 *       200:
 *         description: Stock de productos en la tienda recuperado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               storeId: 'store1'
 *               products:
 *                 - productId: 'product1'
 *                   name: 'Producto 1'
 *                   quantity: 50
 *                 - productId: 'product2'
 *                   name: 'Producto 2'
 *                   quantity: 30
 *       400:
 *         description: No se pudo encontrar el stock de la tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se encontró el stock para la tienda especificada.'
 *       422:
 *         description: Errores de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'storeId', msg: 'El ID de la tienda es inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
