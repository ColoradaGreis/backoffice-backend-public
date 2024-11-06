const { validationResult } = require('express-validator')
const productManager = require('../../core/productManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await productManager.findByEAN(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /product/find:
 *   get:
 *     tags: [Products]
 *     description: Obtener un producto por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ean
 *         schema:
 *           type: string
 *           default: '7'
 *         description: ean del producto.
 *         required: true
 *     responses:
 *       200:
 *         description: Detalles del producto.
 *         content:
 *           application/json:
 *             example:
 *                 {
 *                   "short_name": "Yog Protein+Tro Soprole 155gr, Frut Sec",
 *                   "long_name": "yogurt protein con frutos secos 150gr",
 *                   "content": "155gr",
 *                   "brand": "soprole",
 *                   "id": 168,
 *                   "ean": "7802900003296",
 *                   "sku_sap": "1787599006",
 *                   "sku_vtex": "120204",
 *                   "measure_unit": "gr",
 *                   "content_detail": 155,
 *                   "proxy_duration": "",
 *                   "pack": null,
 *                   "primary_image": null,
 *                   "aisle": "Sin pasillo",
 *                   "generated_ean": false,
 *                   "autoshoppable_available": true,
 *                   "createdAt": "2024-01-25T18:20:50.396Z",
 *                   "category_id": 7,
 *                   "category": "lacteos"
 *                 }
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Errores de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'ean', msg: 'ean del producto requerido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
