const { validationResult } = require('express-validator')
const replenishmentOrderManager = require('../../core/replenishment/replenishmentOrderManager')

/**
 * @openapi
 * /replenishment/{id}:
 *   get:
 *     tags: [Replenishment]
 *     description: Obtener detalles de una orden de reposición por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID de la orden de reposición.
 *         required: true
 *     responses:
 *       200:
 *         description: Detalles de la orden de reposición obtenidos con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: 'Orden A'
 *               start_date: '2023-09-01'
 *               end_date: '2023-09-10'
 *               destination_store_id: 2
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
 *               errors: [{ param: 'id', msg: 'ID de la orden de reposición inválido' }]
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

  const result = await replenishmentOrderManager.get(req.params)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
