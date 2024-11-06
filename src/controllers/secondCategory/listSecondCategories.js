const { validationResult } = require('express-validator')
const secondCategoryManager = require('../../core/categories/secondCategoryManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await secondCategoryManager.list(req.query)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /second-categories:
 *   get:
 *     tags:
 *       - Second Category
 *     description: Devuelve una lista de las categorías de segundo nivel con opción de búsqueda y ordenación.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Búsqueda opcional por nombre de categoría.
 *         required: false
 *         schema:
 *           type: string
 *       - name: order
 *         in: query
 *         description: Ordenar las categorías por nombre (ASC o DESC).
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
 *         description: Lista de categorías de primer nivel recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - name: "aadlkfjlsdjf"
 *                   id: 32
 *                   active: true
 *                   createdAt: "2024-09-23T13:47:18.754Z"
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
