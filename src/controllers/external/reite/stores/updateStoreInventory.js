const { validationResult } = require('express-validator')
const storeManager = require('../../../../core/external/reite/storeManager')
const slackNotifier = require('../../../../services/slack/notifications/index')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  await slackNotifier.sendTemplate('Step 2: Inventory Update', {
    Step: '2',
    Item: req.params.id,
    Added: req.body.added, // Concatenar elementos de la matriz
    Removed: req.body.removed
  })
  const result = await storeManager.putInventory(req.params.id, req.body.added, req.body.removed)

  if (result) {
    await slackNotifier.sendTemplate('Step 2: Inventory Updated', {
      step: '2',
      difference: result.data.difference
    })
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/stores/{storeId}/inventory:
 *   put:
 *     tags: [Reite Store]
 *     description: Actualizar el inventario de una tienda de Reite.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         schema:
 *           type: string
 *           minLength: 5
 *         description: ID de la tienda de Reite.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               added:
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
 *               removed:
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
 *         description: Inventario de la tienda actualizado con éxito.
 *         content:
 *           application/json:
 *             example:
 *       400:
 *         description: No se pudo actualizar el inventario debido a un error.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo actualizar el inventario debido a un error.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'storeId', msg: 'El ID de la tienda es inválido' },
 *                 { param: 'added', msg: 'La lista de productos agregados es inválida' },
 *                 { param: 'removed', msg: 'La lista de productos eliminados es inválida' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
