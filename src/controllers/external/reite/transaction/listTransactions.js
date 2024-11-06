const { validationResult } = require('express-validator')
const transactionManager = require('../../../../core/external/reite/transactionManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await transactionManager.list(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/transactions/list:
 *   get:
 *     tags: [Reite Transaction]
 *     description: Obtener una lista de transacciones de Reite.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transacciones recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               - transactionId: 'txn1'
 *                 amount: 100.00
 *                 timestamp: '2023-09-01T12:00:00Z'
 *                 description: 'Venta de producto A'
 *               - transactionId: 'txn2'
 *                 amount: 50.00
 *                 timestamp: '2023-09-02T14:30:00Z'
 *                 description: 'Venta de producto B'
 *               - transactionId: 'a1vWmG7IU1eHlipxBadO'
 *                 openStoreType: 'RESTOCK'
 *                 requestTimestamp: 1696349057.773661
 *                 transactionTime: 5
 *                 results:
 *                   after: []
 *                   purchased:
 *                     - quantity: 3
 *                       productId: 'DEV_sJsZpm9bxg5T5Sr7u5hf'
 *                     - quantity: 6
 *                       productId: 'DEV_y88ZbEP4duQRUTNWwcQc'
 *                   restocked:
 *                     - quantity: 2
 *                       productId: 'DEV_sJsZpm9bxg5T5Sr7u5hf'
 *                     - quantity: 3
 *                       productId: 'DEV_y88ZbEP4duQRUTNWwcQc'
 *                   before: []
 *                 status: 'DONE'
 *                 storeId: 'DEV_CNV_002'
 *                 userId: '9kzL7vO1m8Ug35cAmD29JbvHkWH2'
 *                 userClientId: '9kzL7vO1m8Ug35cAmD29JbvHkWH2'
 *                 userClient: null
 *       400:
 *         description: No se pudo obtener la lista de transacciones.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo recuperar la lista de transacciones.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
