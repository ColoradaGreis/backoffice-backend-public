const { validationResult } = require('express-validator')
const pickingOperationManager = require('../../core/picking/pickingOperationManager')

/**
 * @openapi
 * /replenishment/{orderId}/picking-operation/{pickingId}:
 *   get:
 *     tags: [Replenishment]
 *     description: Obtener detalles de una operación de picking relacionada con una orden de reposición por sus IDs.
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
 *     responses:
 *       200:
 *         description: Detalles de la operación de picking obtenidos con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: 'Operación A'
 *               quantity: 10
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
 *               errors: [{ param: 'orderId', msg: 'ID de la orden de reposición inválido' }]
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
  const result = await pickingOperationManager.get(req.params)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}
