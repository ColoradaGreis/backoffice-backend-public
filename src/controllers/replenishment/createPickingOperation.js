const { validationResult } = require('express-validator')
const pickingOperationManager = require('../../core/picking/pickingOperationManager')

/**
 * @openapi
 * /replenishment/{orderId}/picking-operation:
 *   post:
 *     tags: [Replenishment]
 *     description: Crear una nueva operación de picking relacionada con una orden de reposición por su ID.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         description: ID de la orden de reposición.
 *         required: true
 *     requestBody:
 *       description: Datos de la nueva operación de picking.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la operación de picking (opcional).
 *               origin_warehouse_id:
 *                 type: integer
 *                 description: ID del almacén de origen de la operación de picking.
 *                 required: true
 *     responses:
 *       201:
 *         description: Operación de picking creada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: 'Operación A'
 *               start_date: '2023-09-01'
 *               origin_warehouse_id: 2
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
  const result = await pickingOperationManager.create(req.body, req.params)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}
