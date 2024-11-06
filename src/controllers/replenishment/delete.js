const { validationResult } = require('express-validator')
const replenishmentOrderManager = require('../../core/replenishment/replenishmentOrderManager')

/**
 * @openapi
 * /replenishment/{id}:
 *   delete:
 *     tags: [Replenishment]
 *     description: Eliminar una orden de reposición por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID de la orden de reposición a eliminar.
 *         required: true
 *     responses:
 *       200:
 *         description: Orden de reposición eliminada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Orden de reposición eliminada correctamente.'
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

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const result = await replenishmentOrderManager.delete(req.params)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}
