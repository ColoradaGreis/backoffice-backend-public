const { validationResult } = require('express-validator')
const stockOperationManager = require('../../core/stockOperationManager')

module.exports = async function (req, res) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await stockOperationManager.getById(req.query.external_transactionId, req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}

/**
 * @openapi
 * /stock/{id}:
 *   get:
 *     tags: [Stock Operation]
 *     description: Obtener detalles de una operación de stock específica.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID de la operación de stock.
 *         required: true
 *       - in: query
 *         name: external_transactionId
 *         schema:
 *           type: string
 *         description: ID externo de la transacción asociada a la operación.
 *         required: true
 *     responses:
 *       200:
 *         description: Detalles de la operación de stock recuperados con éxito.
 *         content:
 *           application/json:
 *             example:
 *               // Detalles de la operación de stock
 *       400:
 *         description: No se pudo recuperar los detalles de la operación de stock.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo recuperar los detalles de la operación de stock.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
