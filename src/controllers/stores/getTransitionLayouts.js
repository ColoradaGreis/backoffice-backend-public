const { validationResult } = require('express-validator')
const storeManager = require('../../core/storeManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await storeManager.getTransitionLayouts(req.params)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /store/{storeId}/layouts/{layoutId}/transition:
 *   get:
 *     tags: [Store]
 *     description: Obtener las transiciones de diseño para una tienda específica.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Token de autenticación (Bearer).
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer your-access-token
 *       - in: path
 *         name: storeId
 *         description: ID de la tienda.
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345
 *       - in: path
 *         name: layoutId
 *         description: ID del diseño.
 *         required: true
 *         schema:
 *           type: string
 *           example: 67890
 *     responses:
 *       200:
 *         description: Lista de transiciones de diseño exitosa.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   traysQuantityDifference: null
 *                   columnsQuantityDifferences: []
 *                   productsToRemove:
 *                     - tray: 0
 *                       column: 2
 *                       productId: "DEV_44xLxt61vQmEpWJR2692"
 *                       maxQuantity: 7
 *                   productsToAdd:
 *                     - tray: 0
 *                       column: 2
 *                       productId: "DEV_CNV_008"
 *                       maxQuantity: 7
 *               notInTransition:
 *                 value:
 *                   message: "The specified layout is not in transition"
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Errores de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - param: 'storeId'
 *                   msg: 'ID de la tienda requerido'
 *                 - param: 'layoutId'
 *                   msg: 'ID del diseño requerido'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
