const { validationResult } = require('express-validator')
const stockManager = require('../../core/stockManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  // console.log('-----------------lisasstAll')

  const idParam = req.query.id

  // Separa los IDs en un array
  const ids = idParam.split('&')
  const result = await stockManager.shoppingList(ids)

  if (result) {
    return res.json(result)
  }
}

/**
 * @openapi
 * /stores/shopping-list:
 *   get:
 *     tags: [Stock]
 *     description: Obtener la lista de productos en la lista de compras.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: IDs de productos en la lista de compras.
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de productos en la lista de compras recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               products:
 *                 - productId: 'product1'
 *                   name: 'Producto 1'
 *                   quantity: 5
 *                 - productId: 'product2'
 *                   name: 'Producto 2'
 *                   quantity: 3
 *       400:
 *         description: No se pudo obtener la lista de productos en la lista de compras.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo obtener la lista de productos en la lista de compras.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
