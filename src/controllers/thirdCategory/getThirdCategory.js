const { validationResult } = require('express-validator')
const thirdCategoryManager = require('../../core/categories/thirdCategoryManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await thirdCategoryManager.getById(req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /third-categories/{id}:
 *   get:
 *     tags:
 *       - Third Category
 *     description: Devuelve los detalles de una categoría de tercer nivel a partir de su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la categoría de tercer nivel que se desea obtener.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la categoría recuperados con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "Bebidas"
 *               active: true
 *               createdAt: "2024-09-23T13:47:18.754Z"
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudo recuperar la categoría."
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
