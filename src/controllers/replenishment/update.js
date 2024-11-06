const { validationResult } = require('express-validator')
const replenishmentOrderManager = require('../../core/replenishment/replenishmentOrderManager')

/**
 * @openapi
 * /replenishment/{id}:
 *   put:
 *     tags: [Replenishment]
 *     description: Actualizar una orden de reposición por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID de la orden de reposición.
 *         required: true
 *     requestBody:
 *       description: Datos de la orden de reposición a actualizar.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre de la orden de reposición (opcional).
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de inicio (opcional).
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de fin (opcional).
 *               destination_store_id:
 *                 type: integer
 *                 description: Nuevo ID de la tienda de destino.
 *                 required: true
 *     responses:
 *       200:
 *         description: Orden de reposición actualizada con éxito.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: 'Orden A (Actualizada)'
 *               start_date: '2023-09-01'
 *               end_date: '2023-09-15'
 *               destination_store_id: 3
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
 *               errors: [{ param: 'destination_store_id', msg: 'ID de la tienda de destino requerido' }]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */

module.exports = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  const result = await replenishmentOrderManager.update(req.body, req.params)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}
