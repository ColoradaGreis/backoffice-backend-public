const { validationResult } = require('express-validator')
const storeManager = require('../../../../core/external/reite/storeManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await storeManager.getProducts(req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/stores/{storeId}/products:
 *   get:
 *     tags: [Reite Store]
 *     description: Obtener los productos de una tienda de Reite por su ID.
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
 *         description: Productos de la tienda recuperados con éxito.
 *         content:
 *           application/json:
 *             example:
 *       400:
 *         description: No se pudo encontrar la tienda o hay un error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo encontrar la tienda o hay un error en la solicitud.'
 *       422:
 *         description: Errores de validación en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'storeId', msg: 'El ID de la tienda es inválido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
