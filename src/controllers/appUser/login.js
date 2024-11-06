const { validationResult } = require('express-validator')
const appUserManager = require('../../core/appUserManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await appUserManager.login(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(401).json({ error: true, message: 'Login failed' })
}
/**
 * @openapi
 * /app-user/login:
 *   post:
 *     tags: [User]
 *     description: Iniciar sesión de usuario.
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
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             example:
 *               userId: '123'
 *               token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *       401:
 *         description: Error de inicio de sesión.
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: 'Login failed'
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
