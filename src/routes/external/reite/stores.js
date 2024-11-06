const express = require('express')
const { body, query, param } = require('express-validator')
const router = express.Router()
const controllers = require('../../../controllers/external/reite/stores')
const tokenManager = require('../../middlewares/tokenManager')

router.get('/list', tokenManager.verifyAppToken, [
  query('active').isBoolean().optional()
], controllers.getStores)

router.get('/inventory', tokenManager.verifyAppToken, [query('storeId').isLength({ min: 5 })], controllers.getStoreInventory)

router.get('/stock', tokenManager.verifyAppToken, [query('storeId').isLength({ min: 5 })], controllers.getStoresStock)

router.get('/:id/products', tokenManager.verifyAppToken, [param('id').isLength({ min: 5 })], controllers.getStoreProducts)

router.post('/:id/open', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 5 }),
  body('userClientId').isLength({ min: 5 }),
  body('openStoreType').isLength({ min: 4 })
], controllers.OpenStore)

router.put('/:id/inventory', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 5 }),
  body('added').isArray(),
  body('removed').isArray()
], controllers.updateStoreInventory)

router.get('/:storeId', tokenManager.verifyAppToken, [param('storeId').isLength({ min: 5 })], controllers.getStoreById)

router.patch('/:storeId/layouts/:layoutId', tokenManager.verifyAppToken, [
  param('storeId').isLength({ min: 5 }),
  param('layoutId').isLength({ min: 5 }),
  body('prices').isObject()
], controllers.updateLayoutStore)

module.exports = router
