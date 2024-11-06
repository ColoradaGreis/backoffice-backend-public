const { validationResult } = require('express-validator')
const storeManager = require('../../../../core/external/reite/storeManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await storeManager.updateLayout(req.params, req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /reite/stores/{storeId}/layouts/{layoutId}:
 *   patch:
 *     tags: [Reite Store]
 *     description: Actualizar el diseño de una tienda de Reite por su ID de tienda y ID de diseño.
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
 *       - in: path
 *         name: layoutId
 *         schema:
 *           type: string
 *           minLength: 5
 *         description: ID del diseño de la tienda de Reite.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prices:
 *                 type: object
 *             required:
 *               - prices
 *     responses:
 *       200:
 *         description: Diseño de la tienda actualizado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               successful: true
 *               message: "Store DEV_CNV_001 layout updated to DEV_WE862puc_v3283798."
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'storeId', msg: 'El ID de la tienda es inválido' }]
 *       500:
 *         description: Error interno del servidor al intentar actualizar el diseño de la tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
