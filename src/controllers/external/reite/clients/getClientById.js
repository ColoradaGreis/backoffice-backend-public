const { validationResult } = require('express-validator')
const clientManager = require('../../../../core/external/reite/clientManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await clientManager.get(req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/clients/{id}:
 *   get:
 *     tags: [Reite Clients]
 *     description: Obtener detalles de un cliente de Reite por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliente a consultar.
 *         schema:
 *           type: string
 *           minLength: 5
 *     responses:
 *       200:
 *         description: Detalles del cliente recuperados con éxito.
 *         content:
 *           application/json:
 *             example:
 *               name: 'Cliente A'
 *               email: 'cliente.a@example.com'
 *               phone: '123-456-7890'
 *       400:
 *         description: No se pudo obtener detalles del cliente.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se encontraron detalles para el cliente solicitado.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'id', msg: 'La longitud del ID debe ser al menos 5.' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
