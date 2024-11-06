const { validationResult } = require('express-validator')
const stockOperationManager = require('../../core/stockOperationManager')
const slackNotifier = require('../../services/slack/notifications/index')
const { logger: LOGGER } = require('../../services/logger/winston')

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() })
  }
  LOGGER.info('Open Store', { metadata: req.body, sendLog: true })
  const result = await stockOperationManager.create(req.body, req.file)
  if (result) {
    LOGGER.info('Open Store response', { metadata: result, sendLog: true })
    await slackNotifier.sendText('Step 1: Store Opened', 'Step 1: Tienda abierta: ' + req.body.store_id)

    return res.status(200).json(result)
  }
  return res.sendStatus(400)
}

/**
 * @openapi
 * /stock/open:
 *   post:
 *     tags: [Stock Operation]
 *     description: Realizar una operación de apertura de tienda en el sistema de inventario.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               store_id:
 *                 type: string
 *               comments:
 *                 type: string
 *               userClientId:
 *                 type: string
 *               openStoreType:
 *                 type: string
 *           required:
 *             - store_id
 *             - userClientId
 *             - openStoreType
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Imagen asociada a la apertura de la tienda.
 *     responses:
 *       200:
 *         description: Operación de apertura de tienda realizada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               // Resultado de la operación
 *       400:
 *         description: No se pudo realizar la operación de apertura de tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo realizar la operación de apertura de tienda.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'store_id', msg: 'El ID de la tienda es requerido' },
 *                 { param: 'comments', msg: 'Los comentarios son requeridos' },
 *                 { param: 'userClientId', msg: 'El ID del cliente es requerido' },
 *                 { param: 'openStoreType', msg: 'El tipo de apertura de tienda es requerido' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
