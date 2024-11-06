const { validationResult } = require('express-validator')
const appUserManager = require('../../core/appUserManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await appUserManager.updatePassword(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /app-user/update-password:
 *   put:
 *     tags: [User]
 *     description: Actualizar la contraseña de un usuario.
 *     security:
 *       - BearerAuth: []
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
 *         description: Contraseña de usuario actualizada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Contraseña actualizada con éxito.'
 *       400:
 *         description: No se pudo actualizar la contraseña del usuario.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo actualizar la contraseña del usuario.'
 *       422:
 *         description: Error de validación en la solicitud.
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
