const { validationResult } = require('express-validator')
const replenishmentOrderManager = require('../../core/replenishment/replenishmentOrderManager')

/**
 * @openapi
 * /replenishment/:
 *   get:
 *     tags: [Replenishment]
 *     description: Obtener una lista de órdenes de reposición.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página.
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página.
 *         required: true
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (opcional) para filtrar órdenes.
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (opcional) para filtrar órdenes.
 *     responses:
 *       200:
 *         description: Lista de órdenes de reposición obtenida con éxito.
 *         content:
 *           application/json:
 *             example:
 *               orders: [{ id: 1, date: '2023-09-01', status: 'Pending' }, { id: 2, date: '2023-09-02', status: 'Completed' }]
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
 *               errors: [{ param: 'page', msg: 'El número de página es inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await replenishmentOrderManager.list(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
