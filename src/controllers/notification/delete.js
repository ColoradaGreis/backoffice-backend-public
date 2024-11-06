const notificationManager = require('../../core/notificationManager')

module.exports = async (req, res) => {
  const { id } = req.params
  const result = await notificationManager.delete(id)
  if (result) {
    return res.json({ message: 'notification deleted', successful: true })
  } else {
    return res.status(400).json({ error: 'No se pudo eliminar' })
  }
}

/**
 * @openapi
 * /notification/{id}:
 *   delete:
 *     tags: [Notifications]
 *     description: Elimina una notificación específica.
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
 *         description: Notificación eliminada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: 'Notificación eliminada.'
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
