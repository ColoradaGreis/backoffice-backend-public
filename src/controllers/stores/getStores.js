const { validationResult } = require('express-validator')
const storeManager = require('../../core/storeManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await storeManager.list(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /store/:
 *   get:
 *     tags: [Stores]
 *     description: Obtener una lista de tiendas.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Token de autenticación (Bearer).
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer your-access-token
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: ''
 *         description: Término de búsqueda (opcional).
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [DESC, ASC]
 *           default: ASC
 *         description: Orden de los resultados (opcional).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página.
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página.
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de tiendas exitosa.
 *         content:
 *           application/json:
 *             example:
 *               stores: [{ id: 1, name: 'Tienda A' }, { id: 2, name: 'Tienda B' }]
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Errores de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'search', msg: 'Término de búsqueda requerido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
