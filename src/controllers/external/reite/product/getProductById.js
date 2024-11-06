const { validationResult } = require('express-validator')
const productManager = require('../../../../core/external/reite/productManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await productManager.getProduct(req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/products/{id}:
 *   get:
 *     tags: [Reite Products]
 *     description: Obtener un producto de Reite por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID del producto de Reite.
 *         required: true
 *     responses:
 *       200:
 *         description: Detalles del producto recuperados con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 'ABC123'
 *               name: 'Producto ABC'
 *               category: 'Categoría X'
 *       400:
 *         description: No se encontró el producto.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se encontró el producto solicitado.'
 *       422:
 *         description: Error de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'id', msg: 'ID del producto inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
