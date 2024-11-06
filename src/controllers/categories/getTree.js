const { validationResult } = require('express-validator')
const categoryManager = require('../../core/categories/categoryManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await categoryManager.getCategoriesTree(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /categories/tree:
 *   get:
 *     tags:
 *       - Categories
 *     description: Obtiene un árbol de categorías con datos anidados de segunda y tercera categoría.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Parámetro opcional para buscar categorías por nombre.
 *         required: false
 *         schema:
 *           type: string
 *       - name: order
 *         in: query
 *         description: Ordenar el resultado de las categorías por nombre (ASC o DESC).
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - name: page
 *         in: query
 *         description: Número de la página que se desea obtener.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Cantidad de resultados por página.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Árbol de categorías recuperado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 data:
 *                   - id: number
 *                     name: "name"
 *                     second_categories:
 *                       - id: number
 *                         name: "name"
 *                         third_categories:
 *                           - id: number
 *                             name: "name"
 *                 meta:
 *                   pagination:
 *                     total: 21
 *                     pages: 3
 *                     page: "1"
 *                     limit: "10"
 *               successful: true
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: "error"
 *       422:
 *         description: Error de validación en los parámetros de la consulta.
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - msg: "Invalid value"
 *                   param: "page"
 *                   location: "query"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
