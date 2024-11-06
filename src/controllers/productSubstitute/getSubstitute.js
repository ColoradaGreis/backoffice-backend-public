const { validationResult } = require('express-validator')
const ProductSubstituteManager = require('../../core/ProductSubstituteManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await ProductSubstituteManager.list(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

// /**
//  * @openapi
//  * /productSubstitute/:
//  *   get:
//  *     tags: [Product-Substitutes]
//  *     description: Obtener una lista de sustitutos de productos.
//  *     parameters:
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *         description: Búsqueda opcional por nombre de producto.
//  *       - in: query
//  *         name: order
//  *         schema:
//  *           type: string
//  *         enum: [DESC, ASC]
//  *         description: Orden opcional de la lista de sustitutos de productos (DESC o ASC).
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *         description: Número de página para paginación.
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *         description: Límite de elementos por página para paginación.
//  *     responses:
//  *       '200':
//  *         description: Lista de sustitutos de productos recuperada con éxito.
//  *         content:
//  *           application/json:
//  *             example:
//  *               productSubstitutes:
//  *                 - id: 1
//  *                   name: Producto1
//  *                   description: Descripción del Producto1
//  *                 - id: 2
//  *                   name: Producto2
//  *                   description: Descripción del Producto2
//  *       '400':
//  *         description: No se pudo obtener la lista de sustitutos de productos.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'No se pudo obtener la lista de sustitutos de productos.'
//  *       '500':
//  *         description: Error interno del servidor al intentar obtener la lista de sustitutos de productos.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor al intentar obtener la lista de sustitutos de productos.'
//  */
