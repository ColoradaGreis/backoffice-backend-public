const { validationResult } = require('express-validator')
const pickingOperationManager = require('../../core/picking/pickingOperationManager')
/**
 * @openapi
 * /replenishment/{orderId}/picking-operation:
 *   get:
 *     tags: [Replenishment]
 *     description: Obtener operaciones de picking relacionadas con una orden de reposición por su ID.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         description: ID de la orden de reposición.
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (opcional).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página (opcional).
 *     responses:
 *       200:
 *         description: Operaciones de picking obtenidas con éxito.
 *         content:
 *           application/json:
 *             example:
 *               operations:
 *                 - id: 1
 *                   name: 'Operación A'
 *                   quantity: 10
 *                 - id: 2
 *                   name: 'Operación B'
 *                   quantity: 5
 *               totalResults: 2
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

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await pickingOperationManager.list(req.query, req.params)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
