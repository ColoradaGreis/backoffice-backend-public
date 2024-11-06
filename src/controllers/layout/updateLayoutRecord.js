const { validationResult } = require('express-validator')
const layoutManager = require('../../core/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await layoutManager.updateLayoutRecord(req.params, req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /layout/record/{storeId}/{layoutId}:
 *   patch:
 *     tags: [Layout]
 *     description: Actualiza el registro de un layout específico de una tienda en la base de datos.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         description: ID de la tienda.
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *       - in: path
 *         name: layoutId
 *         description: ID del layout.
 *         required: true
 *         schema:
 *           type: string
 *           example: "layout_001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               change_position:
 *                 type: boolean
 *                 description: Indica si la posición del layout ha cambiado.
 *                 example: true
 *     responses:
 *       200:
 *         description: Registro del layout actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "Layout record updated successfully"
 *       404:
 *         description: Registro del layout no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Layout record not found"
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Error de validación en los parámetros o en el cuerpo.
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - param: 'storeId'
 *                   msg: 'ID de la tienda es requerido y debe tener al menos un carácter.'
 *                 - param: 'layoutId'
 *                   msg: 'ID del layout es requerido y debe tener al menos un carácter.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
