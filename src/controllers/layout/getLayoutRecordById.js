const { validationResult } = require('express-validator')
const layoutManager = require('../../core/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await layoutManager.getLayoutRecordById(req.params)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /layout/record/{storeId}/{layoutId}:
 *   get:
 *     tags: [Layout]
 *     description: Obtiene el historial de un layout específico de una tienda.
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
 *     responses:
 *       200:
 *         description: Historial del layout obtenido exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               actualLayout:
 *                 store_id: "12345"
 *                 end_date: "2023-12-31"
 *                 is_transition: true
 *               previousLayout:
 *                 store_id: "12345"
 *                 end_date: "2022-12-31"
 *                 is_transition: false
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Error de validación en los parámetros.
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
