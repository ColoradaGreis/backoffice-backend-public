const express = require('express')
const { param } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/stock/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/store/:id', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 5 })
], controllers.getStoreStock)

router.get('/stores', tokenManager.verifyAppToken, controllers.getAllStoresStock)

router.get('/stores/shopping-list', tokenManager.verifyAppToken, controllers.getShoppingList)

router.get('/stores/download', tokenManager.verifyAppToken, controllers.downloadAllStoresStock)

router.get('/stores/shopping-list/download', tokenManager.verifyAppToken, controllers.downloadShoppingList)

module.exports = router
