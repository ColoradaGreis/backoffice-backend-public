const { validationResult } = require('express-validator')
const transactionManager = require('../../../../core/external/reite/transactionManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await transactionManager.getList(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/transactions:
 *   get:
 *     tags: [Reite Transaction]
 *     description: Obtener la lista de transacciones de Reite.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados por página (opcional).
 *       - in: query
 *         name: startTimestamp
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio de la búsqueda (requerida).
 *       - in: query
 *         name: endTimestamp
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin de la búsqueda (requerida).
 *     responses:
 *       200:
 *         description: Lista de transacciones recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               data: [{ transactionId: 'abc123', status: 'completed', timestamp: '2023-01-01T12:00:00Z' }, { transactionId: 'xyz789', status: 'failed', timestamp: '2023-01-02T12:30:00Z' }]
 *       400:
 *         description: No se pudo recuperar la lista de transacciones debido a un error.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo recuperar la lista de transacciones debido a un error.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'limit', msg: 'El límite de resultados es inválido' },
 *                 { param: 'startTimestamp', msg: 'La fecha de inicio es inválida' },
 *                 { param: 'endTimestamp', msg: 'La fecha de fin es inválida' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
