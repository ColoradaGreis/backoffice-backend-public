const { validationResult } = require('express-validator')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }

  return res.status(400).json({ error: 'error' })
}
// /**
//  * @openapi
//  * /quantity-threshold/delete/{id}:
//  *   delete:
//  *     tags: [quantity-threshold]
//  *     description: Eliminar un umbral de cantidad por su ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID del umbral de cantidad a eliminar.
//  *     responses:
//  *       '400':
//  *         description: No se pudo eliminar el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'error'
//  *       '422':
//  *         description: ID de umbral de cantidad no válido.
//  *         content:
//  *           application/json:
//  *             example:
//  *               errors: [{ param: "id", msg: "El ID del umbral de cantidad debe ser numérico", value: "invalid_id" }]
//  *       '500':
//  *         description: Error interno del servidor al intentar eliminar el umbral de cantidad.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor al intentar eliminar el umbral de cantidad.'
//  */
