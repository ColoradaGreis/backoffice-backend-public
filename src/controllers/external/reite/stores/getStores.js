const { validationResult } = require('express-validator')
const storeManager = require('../../../../core/external/reite/storeManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await storeManager.list(req.query)

  if (result) {
    if (req.query.active) {
      const activeStores = result.data.filter(store => store.active)
      return res.json({ data: activeStores })
    }
    return res.json(result.data)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/stores/list:
 *   get:
 *     tags: [Reite Store]
 *     description: Obtener la lista de tiendas de Reite.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar tiendas activas (opcional).
 *     responses:
 *       200:
 *         description: Lista de tiendas recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               data: [{ id: 'abc123', name: 'Tienda A', active: true }, { id: 'xyz789', name: 'Tienda B', active: false }]
 *       400:
 *         description: No se pudo recuperar la lista de tiendas debido a un error.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo recuperar la lista de tiendas debido a un error.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'active', msg: 'El parámetro activo es inválido' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
