const { validationResult } = require('express-validator')
const layoutManager = require('../../core/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const storeId = req.params.storeId
  const page = req.query.page
  const limit = req.query.limit
  const startDate = req.query.startTimestamp
  const endDate = req.query.endTimestamp
  const result = await layoutManager.getLayoutRecord(storeId, page, limit, startDate, endDate)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /layout/record/{storeId}:
 *   get:
 *     tags: [Layout]
 *     description: Obtiene el historial de layouts de la tienda.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         description: ID de la tienda.
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345
 *       - in: query
 *         name: page
 *         description: Número de la página (opcional).
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Límite de registros por página (opcional).
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: startDate
 *         description: Fecha de inicio para filtrar el historial (opcional).
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2023-01-01
 *       - in: query
 *         name: endDate
 *         description: Fecha de fin para filtrar el historial (opcional).
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2023-12-31
 *     responses:
 *       200:
 *         description: Historial de layouts obtenido exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               records: [
 *                 {
 *                   layoutId: "layout_001",
 *                   storeId: "12345",
 *                   date: "2023-01-01",
 *                   porducts_id: ["product_001", "product_002"]
 *                 },
 *                 {
 *                   layoutId: "layout_002",
 *                   storeId: "12345",
 *                   date: "2023-02-01",
 *                   porducts_id: ["product_001", "product_002"]
 *                 }
 *               ]
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
 *                 - param: 'page'
 *                   msg: 'El número de la página debe ser un entero'
 *                 - param: 'limit'
 *                   msg: 'El límite debe ser un entero'
 *                 - param: 'startDate'
 *                   msg: 'La fecha de inicio debe ser válida'
 *                 - param: 'endDate'
 *                   msg: 'La fecha de fin debe ser válida'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
