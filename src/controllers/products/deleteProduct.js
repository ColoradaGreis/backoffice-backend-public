const { validationResult } = require('express-validator')
const productManager = require('../../core/productManager')

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const result = await productManager.delete(req.body)
  if (result) {
    return res.json({ message: 'product deleted', successful: true })
  }
  return res.sendStatus(400)
}

/**
 * @openapi
 * /product/delete:
 *   delete:
 *     tags: [Products]
 *     description: Eliminar un producto por su ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: formData
 *         name: id
 *         type: string
 *         default: '7'
 *         description: ID del producto a eliminar.
 *         required: true
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: 'Producto eliminado correctamente'
 *       400:
 *         description: Error en la solicitud.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error en la solicitud.'
 *       422:
 *         description: Errores de validación.
 *         content:
 *           application/json:
 *             example:
 *               errors: [{ param: 'id', msg: 'ID del producto requerido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
