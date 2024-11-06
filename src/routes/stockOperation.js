const express = require('express')
const router = express.Router()
const { query, body, param } = require('express-validator')
const controllers = require('../controllers/stockOperation/index')

const multer = require('multer')
const tokenManager = require('./middlewares/tokenManager')
const upload = multer({
  limits: {
    fieldSize: 8 * 1024 * 1024
  }
})
// ABRO LA MÁQUINA (PASO 1)
router.post('/open', tokenManager.verifyAppToken, upload.single('image'), [
  body('store_id').isLength({ min: 1 }),
  body('comments').isLength({ min: 1 }).optional(),
  body('userClientId').isLength({ min: 5 }),
  body('openStoreType').isLength({ min: 4 })
], controllers.openStore)

// CONFIRMO INVENTARIO (PASO 2)
router.post('/:id/:transaction_id/inventory', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 5 }), // id de la tienda
  param('transaction_id').isLength({ min: 1 }),
  body('added').isArray(),
  body('removed').isArray()

], controllers.postInventory)

// CONFIRMO RESTOCK (PASO 3)
router.put('/:id/results', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 5 }), // external_transactionId
  body('transaction_id').isLength({ min: 1 }),
  body('comments').isLength({ min: 1 }).optional(),
  body('purchased').isArray(),
  body('restocked').isArray(),
  body('store_id').isLength({ min: 1 })
], controllers.closeStore)

// ME TRAIGO TODAS LAS OPERACIONES DE STOCK
router.get('/', tokenManager.verifyAppToken, [
  // query('search').optional().isLength({ min: 1 }),
  // query('order').optional().isIn(['DESC', 'ASC']),
  // query('page').isNumeric().optional(),
  query('limit').isNumeric().optional(),
  query('startTimestamp').toDate(),
  query('endTimestamp').toDate()

], controllers.getAll)

// ME TRAIGO UNA OPERACIÓN DE STOCK
router.get('/:id', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 1 }), // es el id de la tabla stock_operation
  query('external_transactionId').isLength({ min: 1 })
], controllers.getById)

// PASO 4: UPDATE FINAL IMG EN RESTOCK
router.put('/update/:transaction_id', tokenManager.verifyAppToken, upload.single('image'), [
  param('transaction_id').isLength({ min: 1 }),
  body('comments').optional()
], controllers.updateOperation)

module.exports = router
