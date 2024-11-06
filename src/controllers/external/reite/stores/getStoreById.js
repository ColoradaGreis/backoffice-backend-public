const { validationResult } = require('express-validator')
const storeManager = require('../../../../core/external/reite/storeManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await storeManager.getById(req.params)

  return res.status(200).json(result)
}

/**
 * @openapi
 * /reite/stores/{storeId}:
 *   get:
 *     tags: [Reite Store]
 *     description: Obtener store info a partir de su ID.
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
 *     responses:
 *       200:
 *         description: Inventario de la tienda recuperado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               successful: true
 *               message: "Query successful."
 *               data:
 *                 active: true
 *                 storeId: "DEV_CNV_005"
 *                 clientStoreId: "DEV_CNV_005"
 *                 clientId: "9mNQnyZWfDVuq4LH4lD7"
 *                 productsIds:
 *                   - "DEV_CNV_008"
 *                   - "DEV_uiHjplM7By1xme5G6wlh"
 *                   - "DEV_hWEyMaHk9Duudynqx53Q"
 *                 products:
 *                   - lastRestockTimestamp: 1707837175.445458
 *                     quantity: 8
 *                     productId: "DEV_CNV_008"
 *                   - lastRestockTimestamp: 1707837175.445458
 *                     quantity: 0
 *                     productId: "DEV_uiHjplM7By1xme5G6wlh"
 *                   - lastRestockTimestamp: 1707837175.445458
 *                     quantity: 2
 *                     productId: "DEV_hWEyMaHk9Duudynqx53Q"
 *                 name: "DEV  HubCenco"
 *                 isOpen: false
 *                 lastInventoryUpdate: 1707837953.120548
 *                 lastOpenRequest: 1707837175.794158
 *                 lastOpenType: "RESTOCK"
 *                 lastTransactionId: "c668ba35-8c25-40ae-90b0-79e4e6bc5d0b"
 *                 remoteRestock: true
 *                 layoutId: "117e0c51-9e9a-44b8-b907-d286adf941c3"
 *                 online: true
 *                 location:
 *                   lat: -33.3888353
 *                   lng: -70.5453225
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'storeId', msg: 'El ID de la tienda es inválido' }]
 *       500:
 *         description: Error interno del servidor al intentar recuperar el inventario.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
