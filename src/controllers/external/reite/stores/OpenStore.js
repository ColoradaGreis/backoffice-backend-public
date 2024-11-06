const { validationResult } = require('express-validator')
const storeManager = require('../../../../core/external/reite/storeManager')
const slackNotifier = require('../../../../services/slack/notifications/index')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await storeManager.open(req.params.id, req.body.userClientId, req.body.openStoreType)
  if (result) {
    await slackNotifier.sendText('Step 1: Store Opened', 'Step 1: Tienda abierta: ' + req.params.id)
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/stores/{storeId}/open:
 *   post:
 *     tags: [Reite Store]
 *     description: Abrir una tienda de Reite con la configuración proporcionada.
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
 *               userClientId:
 *                 type: string
 *                 minLength: 5
 *               openStoreType:
 *                 type: string
 *                 minLength: 4
 *             required:
 *               - userClientId
 *               - openStoreType
 *     responses:
 *       200:
 *         description: La tienda se abrió con éxito.
 *         content:
 *           application/json
 *       400:
 *         description: No se pudo abrir la tienda debido a un error.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo abrir la tienda debido a un error.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'storeId', msg: 'El ID de la tienda es inválido' },
 *                 { param: 'userClientId', msg: 'El ID del cliente es inválido' },
 *                 { param: 'openStoreType', msg: 'El tipo de apertura de tienda es inválido' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
