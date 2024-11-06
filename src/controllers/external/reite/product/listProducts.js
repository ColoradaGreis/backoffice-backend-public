const { validationResult } = require('express-validator')
const productManager = require('../../../../core/external/reite/productManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await productManager.list(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/products/list:
 *   get:
 *     tags: [Reite Products]
 *     description: Obtener una lista de productos de Reite.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: 'Producto 1'
 *                 category: 'Categoría A'
 *               - id: 2
 *                 name: 'Producto 2'
 *                 category: 'Categoría B'
 *       400:
 *         description: No se encontraron productos.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No hay productos disponibles en este momento.'
 *       422:
 *         description: Errores de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'search', msg: 'El campo de búsqueda es inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
