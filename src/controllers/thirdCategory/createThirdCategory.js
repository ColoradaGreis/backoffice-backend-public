const { validationResult } = require('express-validator')
const thirdCategoryManager = require('../../core/categories/thirdCategoryManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await thirdCategoryManager.create(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /third-categories/create:
 *   post:
 *     tags:
 *       - Third Category
 *     description: Crea una nueva categoría de tercer nivel. El nombre de la categoría es obligatorio, y el estado activo es opcional.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría.
 *                 example: "Bebidas"
 *               active:
 *                 type: boolean
 *                 description: Estado activo de la categoría (opcional).
 *                 example: true
 *     responses:
 *       201:
 *         description: Categoría creada con éxito.
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
 *               error: "No se pudo crear la categoría."
 *       422:
 *         description: Error de validación en los datos enviados.
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
