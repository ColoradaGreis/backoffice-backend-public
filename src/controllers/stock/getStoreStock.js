const { validationResult } = require('express-validator')
const stockManager = require('../../core/stockManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await stockManager.list(req.params.id)

  if (result) {
    return res.json(result)
  }
}
/**
 * @openapi
 * /stock/store/{storeId}:
 *   get:
 *     tags: [Stock]
 *     description: Obtener la lista de productos en stock para una tienda.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         schema:
 *           type: string
 *           minLength: 5
 *         description: ID de la tienda.
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de productos en stock recuperada con éxito.
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
 *         description: No se pudo obtener la lista de productos en stock para la tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo obtener la lista de productos en stock para la tienda.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'storeId', msg: 'El ID de la tienda es inválido' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
