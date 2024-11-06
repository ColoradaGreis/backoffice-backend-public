const express = require('express')
const { query, body, param } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/stores/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/', tokenManager.verifyAppToken, [
  query('search').optional().isLength({ min: 1 }),
  query('order').optional().isIn(['DESC', 'ASC']),
  query('page').isNumeric(),
  query('limit').isNumeric()
], controllers.getStores)

router.get('/download-adjustment', tokenManager.verifyAppToken, [
  query('storeId').exists().isLength({ min: 5 })
], controllers.downloadInventory)

router.post('/:storeId/layouts/:layoutId', tokenManager.verifyAppToken, [
  param('storeId').exists().isLength({ min: 5 }),
  param('layoutId').exists().isLength({ min: 5 }),
  body('oldLayout').exists().isLength({ min: 1 }),
  body('prices').isObject()
], controllers.updateLayoutStore) // cambio layout de la tienda, creo un Layout de transición y guardo información de fechas y productos en nuestra DB

router.post('/:storeId/save-layouts/:layoutId', tokenManager.verifyAppToken, [
  param('storeId').exists().isLength({ min: 5 }),
  param('layoutId').exists().isLength({ min: 5 }),
  body('oldLayout').exists().isLength({ min: 1 }),
  body('prices').isObject()
], controllers.saveLayoutStore) // cambio layout de la tienda y guardo información de fechas y productos en nuestra DB

// router.get('/:storeId/layouts', tokenManager.verifyAppToken, [
//   query('storeId').exists().isLength({ min: 5 })
// ], controllers.getLayouts)

router.get('/:storeId/layouts/:layoutId/transition', tokenManager.verifyAppToken, [
  param('storeId').exists().isLength({ min: 5 }),
  param('layoutId').exists().isLength({ min: 5 })
], controllers.getTransitionLayouts)

module.exports = router
