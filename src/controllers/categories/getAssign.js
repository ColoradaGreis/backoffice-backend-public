const { validationResult } = require('express-validator')
const categoryManager = require('../../core/categories/categoryManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await categoryManager.getAssign(req.query.thirdCategoryId)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /categories/assign:
 *   get:
 *     tags:
 *       - Categories
 *     description: Devuelve las categorías de primer y segundo nivel a las que pertenece una categoría de tercer nivel específica.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: thirdCategoryId
 *         in: query
 *         description: ID de la categoría de tercer nivel.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asignación de categorías recuperada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 firstCategory:
 *                   id: 1
 *                   name: "bebidas, aguas y jugos"
 *                   secondCategory:
 *                     id: 3
 *                     name: "bebidas gaseosas"
 *                     thirdCategory:
 *                       id: 5
 *                       name: "bebidas light o zero azúcar"
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
 *                   param: "thirdCategoryId"
 *                   location: "query"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
