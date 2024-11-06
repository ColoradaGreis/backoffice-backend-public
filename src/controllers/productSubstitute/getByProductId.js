const { validationResult } = require('express-validator')
const ProductSubstituteManager = require('../../core/ProductSubstituteManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await ProductSubstituteManager.getByProductId(req.params.originalProductId)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
// /**
//  * @openapi
//  * /productSubstitute/{originalProductId}:
//  *   get:
//  *     tags: [Product-Substitutes]
//  *     description: Obtener sustitutos de productos para un producto original por su ID.
//  *     parameters:
//  *       - in: path
//  *         name: originalProductId
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del producto original para el cual se buscan sustitutos.
//  *     responses:
//  *       '200':
//  *         description: Lista de sustitutos de productos para el producto original recuperada con éxito.
//  *         content:
//  *           application/json:
//  *             example:
//  *               productSubstitutes:
//  *                 - id: 1
//  *                   original_product_id: 11
//  *                   replacement_product_id: 12
//  *                   assignment_order: 1
//  *                 - id: 2
//  *                   original_product_id: 11
//  *                   replacement_product_id: 13
//  *                   assignment_order: 2
//  *       '400':
//  *         description: No se pudo obtener la lista de sustitutos de productos para el producto original especificado.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'No se pudo obtener la lista de sustitutos de productos para el producto original especificado.'
//  *       '422':
//  *         description: ID de producto original no válido.
//  *         content:
//  *           application/json:
//  *             example:
//  *               errors: [{ param: "originalProductId", msg: "El ID del producto original debe ser numérico", value: "invalid_id" }]
//  *       '500':
//  *         description: Error interno del servidor al intentar obtener la lista de sustitutos de productos para el producto original.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor al intentar obtener la lista de sustitutos de productos para el producto original.'
//  */
