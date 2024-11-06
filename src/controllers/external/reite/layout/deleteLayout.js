const { validationResult } = require('express-validator')
const layoutManager = require('../../../../core/external/reite/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await layoutManager.delete(req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/layout/{id}:
 *   delete:
 *     tags: [Reite Layout]
 *     description: Eliminar un diseño de tienda por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           minLength: 5
 *         description: ID del diseño de tienda a eliminar.
 *         required: true
 *     responses:
 *       '200':
 *         description: Diseño de tienda eliminado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Diseño de tienda eliminado'
 *               successful: true
 *       '400':
 *         description: No se pudo eliminar el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'error'
 *       '422':
 *         description: Error de validación al intentar eliminar el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'id', msg: 'El ID del diseño debe tener al menos 5 caracteres' }]
 *       '500':
 *         description: Error interno del servidor al intentar eliminar el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
