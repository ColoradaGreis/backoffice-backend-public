const appUserManager = require('../../core/appUserManager')
const { validationResult } = require('express-validator')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await appUserManager.signup(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /app-user/signup:
 *   post:
 *     tags: [User]
 *     description: Registrar un nuevo usuario.
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
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               userId: '123'
 *               email: 'usuario@example.com'
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       409:
 *         description: Conflicto de usuario.
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: 'UsernameExistsException'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
