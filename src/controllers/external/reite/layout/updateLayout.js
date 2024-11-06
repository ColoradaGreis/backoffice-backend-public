const { validationResult } = require('express-validator')
const layoutManager = require('../../../../core/external/reite/layoutManager')

module.exports = async function (req, res, next) {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  const result = await layoutManager.update(req.params.id, req.body)
  if (result) {
    return res.json(result)
  }
  return res.status(400).json({ error: 'error' })
}
/**
 * @openapi
 * /reite/layout/{id}:
 *   put:
 *     tags: [Reite Layout]
 *     description: Actualizar un diseño de tienda existente por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           minLength: 5
 *         description: ID del diseño de tienda a actualizar.
 *         required: true
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
 *                 description: Nuevo nombre del diseño.
 *               layout:
 *                 type: array
 *                 description: Nuevo diseño de la tienda.
 *                 items:
 *                   type: object
 *                   properties:
 *                     columns:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             description: ID del producto.
 *                           maxQuantity:
 *                             type: integer
 *                             description: Cantidad máxima del producto.
 *                     columnsQuantity:
 *                       type: integer
 *                       description: Cantidad de columnas en el diseño.
 *               prices:
 *                 type: object
 *                 description: Nuevos precios de los productos.
 *     responses:
 *       '200':
 *         description: Diseño de tienda actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 'ABC123'
 *               name: 'Nuevo Diseño ABC'
 *               layout: [...]
 *               prices: {...}
 *       '400':
 *         description: No se pudo actualizar el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'error'
 *       '422':
 *         description: Error de validación al actualizar el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'name', msg: 'El nombre del diseño debe tener al menos 5 caracteres' }]
 *       '500':
 *         description: Error interno del servidor al intentar actualizar el diseño de tienda.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
