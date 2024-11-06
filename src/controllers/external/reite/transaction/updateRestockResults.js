const { validationResult } = require('express-validator')
const transactionManager = require('../../../../core/external/reite/transactionManager')
const slackNotifier = require('../../../../services/slack/notifications/index')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  await slackNotifier.sendTemplate('Step 3: Send Restock Results', {
    step: '3',
    transactionId: req.params.id,
    purchased: req.body.purchased,
    restocked: req.body.restocked
  })
  const result = await transactionManager.update(req.params.id, req.body.purchased, req.body.restocked)
  if (result) {
    await slackNotifier.sendText('Step 3: Restock Actualizado', ` Step 3: ${result.message}`)
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/transactions/{transactionId}/results:
 *   patch:
 *     tags: [Reite Transaction]
 *     description: Actualizar los resultados de una transacción de Reite.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 128
 *         description: ID de la transacción de Reite.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchased:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                 minItems: 1
 *               restocked:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Resultados de la transacción actualizados con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Resultados de la transacción actualizados con éxito.'
 *       400:
 *         description: No se pudieron actualizar los resultados de la transacción debido a un error.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudieron actualizar los resultados de la transacción debido a un error.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'transactionId', msg: 'El ID de la transacción es inválido' },
 *                 { param: 'purchased', msg: 'La lista de productos comprados es inválida' },
 *                 { param: 'restocked', msg: 'La lista de productos reabastecidos es inválida' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
