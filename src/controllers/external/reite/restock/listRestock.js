const { validationResult } = require('express-validator')
const restockManager = require('../../../../core/external/reite/restockManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  try {
    const result = await restockManager.list(req.query)
    if (result) {
      return res.json(result)
    }
    return res.status(400).json({ error: 'error' })
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
}

/**
 * @openapi
 * /reite/restock:
 *   get:
 *     tags: [Reite Restock]
 *     description: Obtener una lista de eventos de restock en Reite.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startTimestamp
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del período de búsqueda.
 *         required: true
 *       - in: query
 *         name: endTimestamp
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de finalización del período de búsqueda.
 *         required: true
 *     responses:
 *       200:
 *         description: Lista de eventos de restock recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               - restockId: 'restock1'
 *                 startTimestamp: '2023-09-01T12:00:00Z'
 *                 endTimestamp: '2023-09-01T14:00:00Z'
 *                 description: 'Restock de productos en almacén A'
 *               - restockId: 'restock2'
 *                 startTimestamp: '2023-09-02T14:30:00Z'
 *                 endTimestamp: '2023-09-02T16:30:00Z'
 *                 description: 'Restock de productos en almacén B'
 *       400:
 *         description: No se pudo obtener la lista de eventos de restock.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo recuperar la lista de eventos de restock.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
