const { validationResult } = require('express-validator')
const productManager = require('../../../../core/external/reite/productManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await productManager.noMatch()
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/products/list/noMatch:
 *   get:
 *     tags: [Reite Products]
 *     description: Obtener la lista de productos de Reite sin coincidencias.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos sin coincidencias recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               noMatchProducts: [{ id: 'ABC123', name: 'Producto A' }, { id: 'XYZ789', name: 'Producto X' }]
 *               matchedProducts: [{ id: '123DEF', name: 'Producto 123' }, { id: '456GHI', name: 'Producto 456' }]
 *       400:
 *         description: No se encontró la lista de productos sin coincidencias.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se encontró la lista de productos sin coincidencias.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
