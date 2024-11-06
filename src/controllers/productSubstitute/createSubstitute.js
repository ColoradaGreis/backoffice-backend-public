const { validationResult } = require('express-validator')
const ProductSubstituteManager = require('../../core/ProductSubstituteManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await ProductSubstituteManager.create(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
// /**
//  * @openapi
//  * /productSubstitute/create:
//  *   post:
//  *     tags: [Product-Substitutes]
//  *     description: Crear una nueva asignación de sustituto de producto.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               original_product_id:
//  *                 type: integer
//  *               replacement_product_id:
//  *                 type: integer
//  *               assignment_order:
//  *                 type: integer
//  *     responses:
//  *       '200':
//  *         description: Asignación de sustituto de producto creada con éxito.
//  *         content:
//  *           application/json:
//  *             example:
//  *               id: 1
//  *               original_product_id: 123
//  *               replacement_product_id: 456
//  *               assignment_order: 1
//  *       '400':
//  *         description: No se pudo crear la asignación de sustituto de producto debido a errores de validación.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'No se pudo crear la asignación de sustituto de producto debido a errores de validación.'
//  *       '500':
//  *         description: Error interno del servidor al intentar crear la asignación de sustituto de producto.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor al intentar crear la asignación de sustituto de producto.'
//  */
