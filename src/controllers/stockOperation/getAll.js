const { validationResult } = require('express-validator')
const stockOperationManager = require('../../core/stockOperationManager')

module.exports = async function (req, res) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await stockOperationManager.getAll(req.query)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}

/**
 * @openapi
 * /stock:
 *   get:
 *     tags: [Stock Operation]
 *     description: Obtener todas las operaciones de stock en el sistema.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de operaciones a devolver.
 *       - in: query
 *         name: startTimestamp
 *         schema:
 *           type: string
 *           format: date
 *         description: Marca de tiempo de inicio para filtrar operaciones.
 *       - in: query
 *         name: endTimestamp
 *         schema:
 *           type: string
 *           format: date
 *         description: Marca de tiempo de fin para filtrar operaciones.
 *     responses:
 *       200:
 *         description: Operaciones de stock recuperadas con éxito.
 *         content:
 *           application/json:
 *             example:
 *               // Lista de operaciones de stock
 *       400:
 *         description: No se pudo recuperar las operaciones de stock.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo recuperar las operaciones de stock.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
