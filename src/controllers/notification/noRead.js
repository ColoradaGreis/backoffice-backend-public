const notificationManager = require('../../core/notificationManager')

module.exports = async (req, res) => {
  const { id } = req.params
  const userId = req.query.userId
  const result = await notificationManager.noRead(id, userId)
  if (result) {
    return res.json({ message: 'notification marked as no read', successful: true })
  } else {
    return res.status(400).json({ error: 'No se pudo marcar como no leído' })
  }
}

/**
 * @openapi
 * /notification/noRead/{id}:
 *   delete:
 *     tags: [Notifications]
 *     description: Marca una notificación como no leída.
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
 *         description: Notificación marcada como no leída exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: 'Notificación marcada como no leída.'
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
