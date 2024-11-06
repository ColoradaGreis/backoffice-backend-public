const { validationResult } = require('express-validator')
const productManager = require('../../core/productManager')

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const result = await productManager.create(req.body)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}

/**
 * @openapi
 * /products/create:
 *   post:
 *     tags: [Products]
 *     description: Crear un nuevo producto.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ean:
 *                 type: string
 *               sku_sap:
 *                 type: string
 *               sku_vtex:
 *                 type: string
 *               short_name:
 *                 type: string
 *               long_name:
 *                 type: string
 *               measure_unit:
 *                 type: string
 *               content_detail:
 *                 type: integer
 *               brand:
 *                 type: string
 *               proxy_duration:
 *                 type: string
 *               pack:
 *                 type: string
 *               aisle:
 *                 type: string
 *               generated_ean:
 *                 type: boolean
 *               autoshoppable_available:
 *                 type: boolean
 *               category_id:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Producto creado exitosamente.
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
 *       '400':
 *         description: No se pudo crear el producto.
 *       '422':
 *         description: Error de validación al crear el producto.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: "short_name", msg: "El nombre corto del producto es obligatorio", value: "" }]
 *       '500':
 *         description: Error interno del servidor al intentar crear el producto.
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno del servidor al intentar crear el producto."
 */
