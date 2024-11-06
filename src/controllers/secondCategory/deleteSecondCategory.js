const { validationResult } = require('express-validator')
const secondCategoryManager = require('../../core/categories/secondCategoryManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await secondCategoryManager.delete(req.params.id)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /second-categories/delete/{id}:
 *   delete:
 *     tags:
 *       - Second Category
 *     description: Elimina una categoría de segundo nivel por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la categoría de segundo nivel que se desea eliminar.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "Categoría eliminada con éxito."
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudo eliminar la categoría."
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
