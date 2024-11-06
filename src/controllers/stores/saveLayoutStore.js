const { validationResult } = require('express-validator')
const storeManager = require('../../core/storeManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await storeManager.saveLayoutStore(req.params, req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /store/{storeId}/save-layouts/{layoutId}:
 *   post:
 *     tags: [Store]
 *     description: Guarda el diseño de una tienda específica y almacena información de fechas y productos en la base de datos.
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
 *     requestBody:
 *       description: Datos necesarios para guardar el diseño de la tienda.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prices:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *                 example:
 *                   DEV_dZDTZdbLmfPyoY3YkaW9: 900
 *                   DEV_I2VfA73cDLb8du61Mp5J: 900
 *                   DEV_44xLxt61vQmEpWJR2692: 900
 *               oldLayout:
 *                 type: string
 *                 example: "1713249e-ee6f-4efb-b8dd-07bca7da0baa"
 *     responses:
 *       200:
 *         description: Guardado exitoso del diseño de la tienda.
 *         content:
 *           application/json:
 *             example:
 *               successful: true
 *               message: "Store DEV_CNV_001 layout saved with layout ID DEV_WE862puc_v3283798."
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
 *               errors: [{ param: 'storeId', msg: 'ID de la tienda requerido' }, { param: 'layoutId', msg: 'ID del diseño requerido' }, { param: 'oldLayout', msg: 'Old layout requerido' }, { param: 'prices', msg: 'Prices debe ser un objeto' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
