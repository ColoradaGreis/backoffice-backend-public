const express = require('express')
const { param, body } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/quantity_threshold/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/', tokenManager.verifyAppToken, controllers.getQuantity)

router.post('/create', tokenManager.verifyAppToken, [
  body('productId').isNumeric(),
  body('storeId').isLength({ min: 3, max: 50 }),
  body('stockLevel').isNumeric()
], controllers.createQuantity)

router.delete('/delete/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric()
], controllers.deleteQuantity)

router.put('/update/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric(),
  body('minimum_stock_level').isNumeric()
], controllers.updateQuantity)

router.get('/product/:productId', tokenManager.verifyAppToken, [
  param('productId').isNumeric()
], controllers.getQuantityByProductId)

module.exports = router
