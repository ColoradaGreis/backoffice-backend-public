const { validationResult } = require('express-validator')
const slackNotifier = require('../../services/slack/notifications/index')
const sendSlackNotification = require('../../services/slack/notifications/sendSlackNotification')
const storeManager = require('../../core/external/reite/storeManager')
const stockOperationManager = require('../../core/stockOperationManager')
const { logger: LOGGER } = require('../../services/logger/winston')

module.exports = async function (req, res) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const products = await storeManager.getProducts(req.params.id)
  const metadata = await addMetadata(products, req.body.added, req.body.removed)
  LOGGER.info('Step 2: Datos para actualizar inventario', { metadata, sendLog: true })

  await sendSlackNotification(products, req.body.added, req.body.removed, 2, 'Datos para actualizar inventario')

  const result = await stockOperationManager.postInventory(req.params.id, req.params.transaction_id, req.body.added, req.body.removed)
  if (result && result.data) {
    if (global.SHOW_PRODUCT_NAMES) {
      const response = {
        result,
        products: []
      }
      for (const item in result.data.difference) {
        const product = products.data.find(product => product.productId === item)
        const productObject = {
          nombre: product.productName,
          diferencia: result.data.difference[item]
        }
        response.products.push(productObject)
      }
      LOGGER.info('Step 2: Inventario actualizado', { metadata: response, sendLog: true })
      await slackNotifier.sendTemplate('Step 2: Inventory Updated', {
        step: '2',
        text: 'Respuesta de reite',
        difference: response.products
      })
      return res.json(response)
    } else {
      LOGGER.info('Step 2: Inventario actualizado', { metadata: result.data.difference, sendLog: true })

      await slackNotifier.sendTemplate('Step 2: Inventory Updated', {
        step: '2',
        text: 'Respuesta de reite',
        difference: result.data.difference
      })

      return res.json(result)
    }
  }
  return res.status(400).json({ error: 'error' })
}

async function addMetadata (products, added, removed) {
  const notification = {
    agregados: [],
    removidos: []
  }

  // Iterar sobre 'added'
  added.forEach(item => {
    const product = products.data.find(product => product.productId === item.productId)
    const productObject = {
      producto: product.productName,
      cantidad: item.quantity
    }
    notification.agregados.push(productObject)
  })

  // Iterar sobre 'removed'
  removed.forEach(item => {
    const product = products.data.find(product => product.productId === item.productId)
    const productObject = {
      producto: product.productName,
      cantidad: item.quantity
    }
    notification.removidos.push(productObject)
  })
  return notification
}
/**
 * @openapi
 * /stock/{id}/{transaction_id}/inventory:
 *   post:
 *     tags: [Stock Operation]
 *     description: Realizar una operación de actualización de inventario para una tienda específica.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: ID de la tienda.
 *         required: true
 *       - in: path
 *         name: transaction_id
 *         schema:
 *           type: string
 *         description: ID de la transacción.
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
 *                   // Definir el esquema de los elementos en el array "added"
 *               removed:
 *                 type: array
 *                 items:
 *                   // Definir el esquema de los elementos en el array "removed"
 *           required:
 *             - added
 *             - removed
 *     responses:
 *       200:
 *         description: Operación de actualización de inventario realizada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               // Resultado de la operación de actualización de inventario
 *       400:
 *         description: No se pudo realizar la operación de actualización de inventario.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo realizar la operación de actualización de inventario.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [
 *                 { param: 'id', msg: 'El ID de la tienda es inválido' },
 *                 { param: 'transaction_id', msg: 'El ID de la transacción es inválido' },
 *                 { param: 'added', msg: 'La lista de productos añadidos es inválida' },
 *                 { param: 'removed', msg: 'La lista de productos eliminados es inválida' }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
