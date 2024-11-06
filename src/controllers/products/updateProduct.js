const { validationResult } = require('express-validator')
const productManager = require('../../core/productManager')
const { logger: LOGGER } = require('../../services/logger/winston')

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  LOGGER.info('update product', { metadata: req.body, sendLog: true })

  const result = await productManager.update(req.body)
  LOGGER.info('product updated', { metadata: result, sendLog: true })
  if (result) {
    return res.json({ message: 'product updated', successful: true, data: result })
  }
  return res.sendStatus(400)
}

/**
 * @openapi
 * /products/update:
 *   put:
 *     tags: [Products]
 *     description: Actualizar un producto existente.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               ean:
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
 *         description: Producto actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: 'product updated'
 *               successful: true
 *       '400':
 *         description: No se pudo actualizar el producto.
 *       '422':
 *         description: Error de validación al actualizar el producto.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: "id", msg: "El ID del producto es obligatorio", value: "" }]
 *       '500':
 *         description: Error interno del servidor al intentar actualizar el producto.
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno del servidor al intentar actualizar el producto."
 */
