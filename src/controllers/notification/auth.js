const { validationResult } = require('express-validator')
const notificationManager = require('../../core/notificationManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await notificationManager.auth(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /notification/auth:
 *   post:
 *     tags: [Notifications]
 *     description: Autenticación de notificaciones.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           required:
 *             - email
 *             - password
 *     responses:
 *       200:
 *         description: Autenticación exitosa.
 *         content:
 *           application/json:
 *             example:
 *               userId: '123'
 *               token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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
 *               errors: [{ param: 'email', msg: 'El formato del correo es inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
