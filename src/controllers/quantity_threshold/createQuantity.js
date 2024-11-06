const { validationResult } = require('express-validator')
const quantityManager = require('../../core/quantityManager')

module.exports = async (req, res) => {
  const reqErrors = validationResult(req)
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() })
  }
  const result = await quantityManager.create(req.body)
  if (result) {
    return res.json(result)
  }

  return res.status(400).json({ error: 'error' })
}

// /**
//  * @openapi
//  * /quantity-threshold/create:
//  *   post:
//  *     tags: [Quantity Threshold]
//  *     description: Crea un nuevo umbral de cantidad para un producto específico en una tienda.
//  *     parameters:
//  *       - in: header
//  *         name: Authorization
//  *         description: Token de autenticación (Bearer).
//  *         required: true
//  *         schema:
//  *           type: string
//  *           example: Bearer your-access-token
//  *     requestBody:
//  *       description: Datos necesarios para crear el umbral de cantidad.
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               productId:
//  *                 type: number
//  *                 example: 12345
//  *               storeId:
//  *                 type: string
//  *                 minLength: 3
//  *                 maxLength: 50
//  *                 example: "store_001"
//  *               stockLevel:
//  *                 type: number
//  *                 example: 100
//  *     responses:
//  *       200:
//  *         description: Umbral de cantidad creado exitosamente.
//  *         content:
//  *           application/json:
//  *             example:
//  *               successful: true
//  *               message: "Quantity threshold created successfully."
//  *       400:
//  *         description: Error en la solicitud.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error en la solicitud.'
//  *       422:
//  *         description: Errores de validación.
//  *         content:
//  *           application/json:
//  *             example:
//  *               errors: [{ param: 'productId', msg: 'El ID del producto debe ser numérico' }, { param: 'storeId', msg: 'El ID de la tienda debe tener entre 3 y 50 caracteres' }, { param: 'stockLevel', msg: 'El nivel de stock debe ser numérico' }]
//  *       500:
//  *         description: Error interno del servidor.
//  *         content:
//  *           application/json:
//  *             example:
//  *               error: 'Error interno del servidor.'
//  */
