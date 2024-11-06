const { validationResult } = require('express-validator')
const notificationManager = require('../../core/notificationManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await notificationManager.read(req.params.id, req.query.userId)
  if (result) {
    return res.status(200).json({ message: 'Notificación marcada como leída', successful: true })
  }
  res.status(500).json({ error: 'Error interno del servidor' })
}
/**
 * @openapi
 * /notification/read/{id}:
 *   put:
 *     tags: [Notifications]
 *     description: Marca una notificación como leída.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la notificación.
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345
 *     responses:
 *       200:
 *         description: Notificación marcada como leída exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: 'Notificación marcada como leída.'
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Error de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'id', msg: 'ID de la notificación requerido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
