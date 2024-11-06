const { validationResult } = require('express-validator')
const quantityManager = require('../../core/quantityManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await quantityManager.update(req.params, req.body)
  if (result) {
    return res.json(result)
  }

  return res.status(400).json({ error: 'error' })
}
// /**
//  * @openapi
//  * /quantity-threshold/update/{id}:
//  *   put:
//  *     tags: [quantity-threshold]
//  *     description: Actualizar un umbral de cantidad por su ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del umbral de cantidad a actualizar.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               minimum_stock_level:
//  *                 type: integer
//  *     responses:
//  *       '200':
//  *         description: Umbral de cantidad actualizado exitosamente.
//  *         content:
//  *           application/json:
//  *             example:
//  *               id: 1
//  *               minimum_stock_level: 100
//  *       '400':
//  *         description: No se pudo actualizar el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'error'
//  *       '422':
//  *         description: Error de validación al actualizar el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               errors: [{ param: "minimum_stock_level", msg: "El nivel de stock mínimo debe ser un número", value: "invalid_minimum_stock_level" }]
//  *       '500':
//  *         description: Error interno del servidor al intentar actualizar el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor al intentar actualizar el umbral de cantidad.'
//  */
