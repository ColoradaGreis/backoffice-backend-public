const { validationResult } = require('express-validator')
const appUserManager = require('../../core/appUserManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await appUserManager.update(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /app-user/update:
 *   put:
 *     tags: [User]
 *     description: Actualizar información de un usuario.
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
 *                 type: interger
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               first_name:
 *                 type: string
 *               middle_name:
 *                 type: string
 *               first_lastname:
 *                 type: string
 *               second_lastname:
 *                 type: string
 *           required:
 *             - id
 *     responses:
 *       200:
 *         description: Información de usuario actualizada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 id: 1
 *                 email: updated@example.com
 *                 role: admin
 *                 first_name: John
 *                 middle_name: Doe
 *                 first_lastname: Smith
 *                 second_lastname: Johnson
 *       400:
 *         description: No se pudo actualizar la información del usuario.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo actualizar la información del usuario.'
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
