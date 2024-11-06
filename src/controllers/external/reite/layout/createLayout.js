const { validationResult } = require('express-validator')
const layoutManager = require('../../../../core/external/reite/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await layoutManager.create(req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}

/**
 * @openapi
 * /reite/layout:
 *   post:
 *     tags: [Reite Layout]
 *     description: Crear un nuevo diseño de tienda.
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
 *                 minLength: 5
 *               layout:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Nombre del diseño.
 *                     layout:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           columns:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 productId:
 *                                   type: string
 *                                   description: ID del producto.
 *                                 maxQuantity:
 *                                   type: integer
 *                                   description: Cantidad máxima del producto.
 *                           columnsQuantity:
 *                             type: integer
 *                             description: Cantidad de columnas en el diseño.
 *     responses:
 *       '200':
 *         description: Diseño de tienda creado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 'ABC123'
 *               name: 'Diseño ABC'
 *               layout: [...]
 *       '400':
 *         description: No se pudo crear el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'error'
 *       '422':
 *         description: Error de validación al crear el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'name', msg: 'El nombre del diseño debe tener al menos 5 caracteres' }]
 *       '500':
 *         description: Error interno del servidor al intentar crear el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
