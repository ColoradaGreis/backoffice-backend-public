const { validationResult } = require('express-validator')
const notificationManager = require('../../core/notificationManager')
const { logger: LOGGER } = require('../../services/logger/winston')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await notificationManager.create(req.body)
  LOGGER.info('nueva notificación tienda', { metadata: req.body, sendLog: true })
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /notification/reite/webhook/RdtfLQYiAUAvDntbFEHZEWbiIHQSGYqt:
 *   post:
 *     tags: [Notifications]
 *     description: Manejo de webhook para Reite.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       200:
 *         description: Webhook procesado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Webhook procesado con éxito'
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
 *               errors: [{ param: 'parametro', msg: 'Mensaje de error' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
