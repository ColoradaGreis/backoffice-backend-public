const { validationResult } = require('express-validator')
const appUserManager = require('../../core/appUserManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await appUserManager.delete(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /app-user/delete:
 *   delete:
 *     tags: [User]
 *     description: Eliminar un usuario.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               email:
 *                 type: string
 *           required:
 *             - id
 *             - email
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Usuario eliminado con éxito.'
 *       400:
 *         description: No se pudo eliminar el usuario.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo eliminar el usuario.'
 *       422:
 *         description: Error de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'id', msg: 'El campo ID debe ser válido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
