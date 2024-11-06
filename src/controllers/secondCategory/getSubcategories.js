const { validationResult } = require('express-validator')
const secondCategoryManager = require('../../core/categories/secondCategoryManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await secondCategoryManager.getSubcategories(req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /second-categories/{id}/subcategories:
 *   get:
 *     tags:
 *       - Second Category
 *     description: Devuelve las subcategorías asociadas a una categoría de segundo nivel identificada por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la categoría de segundo nivel para obtener sus subcategorías.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subcategorías recuperadas con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 2
 *               name: "belleza y cuidado personal"
 *               subcategories:
 *                 - name: "protección femenina"
 *                   id: 6
 *                   createdAt: "2024-09-03T19:57:07.898Z"
 *                   first_category_id: 2
 *                 - name: "cuidado bucal"
 *                   id: 7
 *                   createdAt: "2024-09-03T19:57:08.223Z"
 *                   first_category_id: 2
 *                 - name: "cuidado capilar"
 *                   id: 8
 *                   createdAt: "2024-09-03T19:57:08.866Z"
 *                   first_category_id: 2
 *                 - name: "cuidado de la piel"
 *                   id: 9
 *                   createdAt: "2024-09-03T19:57:09.476Z"
 *                   first_category_id: 2
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudieron obtener las subcategorías."
 *       422:
 *         description: Error de validación en el parámetro ID.
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - msg: "Invalid value"
 *                   param: "id"
 *                   location: "params"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
