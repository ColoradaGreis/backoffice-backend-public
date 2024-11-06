const { validationResult } = require('express-validator')
const clientManager = require('../../../../core/external/reite/clientManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await clientManager.list(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/clients/list:
 *   get:
 *     tags: [Reite Clients]
 *     description: Obtener una lista de clientes de Reite.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               - name: 'Cliente A'
 *                 email: 'cliente.a@example.com'
 *                 phone: '123-456-7890'
 *               - name: 'Cliente B'
 *                 email: 'cliente.b@example.com'
 *                 phone: '987-654-3210'
 *       400:
 *         description: No se encontraron clientes.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No hay clientes disponibles en este momento.'
 *       422:
 *         description: Errores de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'search', msg: 'El campo de búsqueda es inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
