const { validationResult } = require('express-validator')
const appUserManager = require('../../core/appUserManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await appUserManager.list(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /app-user:
 *   get:
 *     tags: [User]
 *     description: Obtener una lista de usuarios.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               users:
 *                 - id: 1
 *                   username: user1
 *                   email: user1@example.com
 *                 - id: 2
 *                   username: user2
 *                   email: user2@example.com
 *       400:
 *         description: No se pudo obtener la lista de usuarios.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo obtener la lista de usuarios.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
