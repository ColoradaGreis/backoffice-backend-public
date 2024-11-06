const { validationResult } = require('express-validator')
const stockManager = require('../../core/stockManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const idParam = req.query.id
  const ids = idParam.split('&')
  const result = await stockManager.listAll(ids)

  if (result) {
    return res.json(result)
  }
}

/**
 * @openapi
 * /stock/stores:
 *   get:
 *     tags: [Stock]
 *     description: Obtener la lista de productos en stock para varias tiendas.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID(s) de la(s) tienda(s) separados por '&'.
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de productos en stock para las tiendas recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               stores:
 *                 - storeId: 'store1'
 *                   products:
 *                     - productId: 'product1'
 *                       name: 'Producto 1'
 *                       quantity: 50
 *                     - productId: 'product2'
 *                       name: 'Producto 2'
 *                       quantity: 30
 *                 - storeId: 'store2'
 *                   products:
 *                     - productId: 'product3'
 *                       name: 'Producto 3'
 *                       quantity: 20
 *       400:
 *         description: No se pudo obtener la lista de productos en stock para las tiendas.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo obtener la lista de productos en stock para las tiendas.'
 *       422:
 *         description: Error de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'id', msg: 'El parámetro de ID es inválido' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
