const { validationResult } = require('express-validator')
const productManager = require('../../core/productManager')

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
 * /product/list:
 *   get:
 *     tags: [Products]
 *     description: Obtener una lista de productos.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: ''
 *         description: Término de búsqueda (opcional).
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [DESC, ASC]
 *           default: ASC
 *         description: Orden de los resultados (opcional).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página.
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página.
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de productos exitosa.
 *         content:
 *           application/json:
 *             example:
 *               data: [
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
 *                 },
 *                 {
 *                   "short_name": "Yog Soprole 1+1 C/Cuchara, Mini Cookies",
 *                   "long_name": "yogurt 1+1 mini cookies",
 *                   "content": "140gr",
 *                   "brand": "soprole",
 *                   "id": 99,
 *                   "ean": "7802900228170",
 *                   "sku_sap": "891081003",
 *                   "sku_vtex": "100521",
 *                   "measure_unit": "gr",
 *                   "content_detail": 140,
 *                   "proxy_duration": "",
 *                   "pack": null,
 *                   "primary_image": null,
 *                   "aisle": "Yogurt",
 *                   "generated_ean": false,
 *                   "autoshoppable_available": true,
 *                   "createdAt": "2024-01-25T18:20:24.190Z",
 *                   "category_id": 7,
 *                   "category": "lacteos"
 *                 }
 *               ]
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
 *               errors: [{ param: 'search', msg: 'Término de búsqueda requerido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
