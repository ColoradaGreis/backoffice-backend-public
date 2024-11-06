const { validationResult } = require('express-validator')
const slackNotifier = require('../../services/slack/notifications/index')
const sendSlackNotification = require('../../services/slack/notifications/sendSlackNotification')
const stockOperationManager = require('../../core/stockOperationManager')
const storeManager = require('../../core/external/reite/storeManager')
const { logger: LOGGER } = require('../../services/logger/winston')

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() })
  }
  // console.log(req.body, 'req.body')
  LOGGER.info('envío productos agregados/removidos', { metadata: { body: req.body, params: req.params }, sendLog: true })

  const products = await storeManager.getProducts(req.body.store_id)
  // console.log(products, 'products')
  await sendSlackNotification(products, req.body.restocked, req.body.purchased, 3, 'envío productos agregados/removidos')
  const result = await stockOperationManager.close(req.params, req.body)
  if (result) {
    LOGGER.info('Step 3: Restock Actualizado', { metadata: result, sendLog: true })
    await slackNotifier.sendText('Step 3: Restock Actualizado', ` Step 3: ${result.message}`)

    return res.status(200).json(result)
  }
  return res.sendStatus(400)
}

/**
 * @openapi
 * /stock/{id}/results:
 *   put:
 *     tags: [Stock Operation]
 *     description: Confirmar el restock (Paso 3) para una transacción externa específica.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID de la transacción externa.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_id:
 *                 type: string
 *               comments:
 *                 type: string
 *               purchased:
 *                 type: array
 *                 items:
 *                   // Definir el esquema de los elementos en el array "purchased"
 *               restocked:
 *                 type: array
 *                 items:
 *                   // Definir el esquema de los elementos en el array "restocked"
 *               store_id:
 *                 type: string
 *           required:
 *             - transaction_id
 *             - purchased
 *             - restocked
 *             - store_id
 *     responses:
 *       200:
 *         description: Restock confirmado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               // Resultado de la confirmación de restock
 *       400:
 *         description: No se pudo confirmar el restock.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo confirmar el restock.'
 *       403:
 *         description: La transacción ya fue validada.
 *         content:
 *           application/json:
 *             example:
 *               error: 'La transacción ya fue validada.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
