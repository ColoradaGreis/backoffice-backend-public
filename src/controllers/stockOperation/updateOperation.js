const { validationResult } = require('express-validator')
const stockOperationManager = require('../../core/stockOperationManager')

module.exports = async function (req, res) {
  const reqErrors = validationResult(req)

  if (!reqErrors.isEmpty()) {
    // console.log(reqErrors)
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await stockOperationManager.update(req.params.transaction_id, req.body.comments, req.file)
  if (result) {
    return res.json(result)
  }
  return res.sendStatus(400)
}

/**
 * @openapi
 * /stock/update/{transaction_id}:
 *   put:
 *     tags: [Stock Operation]
 *     description: Actualizar información final en una operación de restock (Paso 4).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         schema:
 *           type: string
 *         description: ID de la transacción asociada a la operación de restock.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *           required:
 *             - comments
 *     responses:
 *       200:
 *         description: Información final actualizada con éxito en la operación de restock.
 *         content:
 *           application/json:
 *             example:
 *               // Resultado de la actualización final en la operación de restock
 *       400:
 *         description: No se pudo actualizar la información final en la operación de restock.
 *         content:
 *           application/json:
 *             example:
 *               error: 'No se pudo actualizar la información final en la operación de restock.'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: 'Error interno del servidor.'
 */
