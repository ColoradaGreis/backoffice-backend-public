const express = require('express')
const { param, body, query } = require('express-validator')
const router = express.Router()
const controllers = require('../../../controllers/external/reite/product/index')
const tokenManager = require('../../middlewares/tokenManager')

router.get('/list', tokenManager.verifyAppToken, [
  query('eans').optional().isString()

], controllers.listProducts)

router.get('/:id', tokenManager.verifyAppToken, [param('id').isLength({ min: 5 })], controllers.getProductById)

router.get('/list/noMatch', tokenManager.verifyAppToken, [], controllers.noMatched)

router.patch('/:productId', tokenManager.verifyAppToken, [
  param('productId').isLength({ min: 5 }),
  body('brand').isLength({ min: 1 }),
  body('name').isLength({ min: 1 }),
  body('storeId').isLength({ min: 1 }),
  body('price').isNumeric()
], controllers.updatePrice)

module.exports = router
