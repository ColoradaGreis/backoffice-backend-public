const { validationResult } = require('express-validator')
const layoutManager = require('../../../../core/external/reite/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await layoutManager.list()
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/layout/list:
 *   get:
 *     tags: [Reite Layout]
 *     description: Obtener una lista de diseños de Reite.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de diseños recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: 'Diseño 1'
 *                 description: 'Descripción del Diseño 1.'
 *               - id: 2
 *                 name: 'Diseño 2'
 *                 description: 'Descripción del Diseño 2.'
 *       400:
 *         description: No se encontraron diseños.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No hay diseños disponibles en este momento.'
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
