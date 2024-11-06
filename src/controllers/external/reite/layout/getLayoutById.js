const { validationResult } = require('express-validator')
const layoutManager = require('../../../../core/external/reite/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await layoutManager.getLayout(req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/layout/{id}:
 *   get:
 *     tags: [Reite Layout]
 *     description: Obtener un layout de una Store por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID de la store de la cual queremos obtener su layout.
 *         required: true
 *     responses:
 *       200:
 *         description: Detalles del diseño recuperados con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 'ABC123'
 *               name: 'Diseño ABC'
 *               description: 'Descripción del Diseño ABC.'
 *       400:
 *         description: No se encontró el diseño.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se encontró el diseño solicitado.'
 *       422:
 *         description: Error de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'id', msg: 'ID del diseño inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
