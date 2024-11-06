const { validationResult } = require('express-validator')
const pickingOperationManager = require('../../core/picking/pickingOperationManager')

/**
 * @openapi
 * /replenishment/{orderId}/picking-operation/{pickingId}:
 *   put:
 *     tags: [Replenishment]
 *     description: Actualizar una operación de picking relacionada con una orden de reposición por sus IDs.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         description: ID de la orden de reposición.
 *         required: true
 *       - in: path
 *         name: pickingId
 *         schema:
 *           type: integer
 *         description: ID de la operación de picking.
 *         required: true
 *     requestBody:
 *       description: Datos actualizados de la operación de picking.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de inicio de la operación de picking (opcional).
 *               origin_warehouse_id:
 *                 type: integer
 *                 description: Nuevo ID del almacén de origen de la operación de picking.
 *                 required: true
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del producto a agregar a la operación (opcional).
 *                     quantity:
 *                       type: integer
 *                       description: Cantidad del producto a agregar a la operación (opcional).
 *     responses:
 *       200:
 *         description: Operación de picking actualizada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: 'Operación A'
 *               start_date: '2023-09-15'
 *               origin_warehouse_id: 3
 *               products: [{ id: 5, quantity: 10 }]
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
 *               errors: [{ param: 'origin_warehouse_id', msg: 'ID del almacén de origen requerido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const result = await pickingOperationManager.update(req.body, req.params)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}
