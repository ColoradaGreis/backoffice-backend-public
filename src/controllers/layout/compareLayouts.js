const { validationResult } = require('express-validator')
const layoutManager = require('../../core/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await layoutManager.compare(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /layout/compare:
 *   get:
 *     tags: [Layout]
 *     description: Compara dos layouts de tienda específicos.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: actualLayoutId
 *         description: ID del layout actual.
 *         required: true
 *         schema:
 *           type: string
 *           example: "layout_001"
 *       - in: query
 *         name: oldLayoutId
 *         description: ID del layout antiguo.
 *         required: true
 *         schema:
 *           type: string
 *           example: "layout_002"
 *     responses:
 *       200:
 *         description: Comparación de layouts realizada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               traysQuantityDifference: null
 *               columnsQuantityDifferences:
 *                 - tray: 0
 *                   layout1: 3
 *                   layout2: 4
 *               productsToRemove: []
 *               productsToAdd: []
 *               productsPositionChanged:
 *                 - productId: "DEV_dZDTZdbLmfPyoY3YkaW9"
 *                   from:
 *                     tray: 0
 *                     column: 0
 *                   to:
 *                     - tray: 0
 *                       column: 2
 *                     - tray: 0
 *                       column: 3
 *                 - productId: "DEV_I2VfA73cDLb8du61Mp5J"
 *                   from:
 *                     tray: 0
 *                     column: 1
 *                   to:
 *                     - tray: 0
 *                       column: 0
 *                 - productId: "DEV_44xLxt61vQmEpWJR2692"
 *                   from:
 *                     tray: 0
 *                     column: 2
 *                   to:
 *                     - tray: 0
 *                       column: 1
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
 *                 - param: 'actualLayoutId'
 *                   msg: 'ID del layout actual es requerido.'
 *                 - param: 'oldLayoutId'
 *                   msg: 'ID del layout antiguo es requerido.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
