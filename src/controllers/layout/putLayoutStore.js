const { validationResult } = require('express-validator')
const layoutManager = require('../../core/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await layoutManager.putLayoutStore(req.body.oldLayout, req.body.storeId, req.body.activeLayout)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /layout/put-layout-store:
 *   post:
 *     tags: [Layout]
 *     description: Actualiza el diseño de una tienda solo en la base de datos.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeId:
 *                 type: string
 *                 description: ID de la tienda.
 *                 example: "12345"
 *               oldLayout:
 *                 type: string
 *                 description: ID del diseño anterior.
 *                 example: "old-layout-id"
 *               activeLayout:
 *                 type: string
 *                 description: ID del diseño activo.
 *                 example: "active-layout-id"
 *     responses:
 *       200:
 *         description: Diseño de la tienda actualizado exitosamente en la base de datos.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Layout updated successfully'
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Error de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - param: 'storeId'
 *                   msg: 'ID de la tienda es requerido'
 *                 - param: 'oldLayout'
 *                   msg: 'ID del diseño anterior es requerido'
 *                 - param: 'activeLayout'
 *                   msg: 'ID del diseño activo es requerido'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
