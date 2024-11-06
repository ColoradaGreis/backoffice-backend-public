const { validationResult } = require('express-validator')
const appUserManager = require('../../core/appUserManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await appUserManager.get(req.params)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /app-user/{userId}:
 *   get:
 *     tags: [User]
 *     description: Obtener detalles de un usuario por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del usuario.
 *         required: true
 *     responses:
 *       200:
 *         description: Detalles del usuario recuperados con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               username: user1
 *               email: user1@example.com
 *       400:
 *         description: No se pudo obtener los detalles del usuario debido a un error.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo obtener los detalles del usuario debido a un error.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'userId', msg: 'El ID del usuario debe ser un número entero válido' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
