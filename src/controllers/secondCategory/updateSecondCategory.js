const { validationResult } = require('express-validator')
const secondCategoryManager = require('../../core/categories/secondCategoryManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await secondCategoryManager.update(req.params.id, req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /second-categories/update/{id}:
 *   patch:
 *     tags:
 *       - Second Category
 *     description: Actualiza los campos de una categoría de segundo nivel, como el nombre o el estado activo.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la categoría de segundo nivel que se desea actualizar.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre de la categoría (opcional).
 *                 example: "Nueva Categoría"
 *               active:
 *                 type: boolean
 *                 description: Estado activo de la categoría (opcional).
 *                 example: true
 *     responses:
 *       200:
 *         description: Categoría actualizada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "Nueva Categoría"
 *               active: true
 *               updatedAt: "2024-09-23T13:47:18.754Z"
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudo actualizar la categoría."
 *       422:
 *         description: Error de validación en los parámetros o en el cuerpo de la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               errors:
 *                 - msg: "Invalid value"
 *                   param: "name"
 *                   location: "body"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
