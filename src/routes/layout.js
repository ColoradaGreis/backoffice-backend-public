const express = require('express')
const { query, body, param } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/layout/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/compare', tokenManager.verifyAppToken, [
  query('actualLayoutId'),
  query('oldLayoutId')
], controllers.compareLayouts)

router.post('/put-layout-store', tokenManager.verifyAppToken, [
  body('storeId'),
  body('oldLayout'),
  body('activeLayout')
], controllers.putLayoutStore) // actualizo el layout de la tienda sólo en nuestra DB

router.get('/record/:storeId', tokenManager.verifyAppToken, [
  param('storeId').isLength({ min: 1 }),
  query('page').isInt().optional(),
  query('limit').isInt().optional(),
  query('startTimestamp').toDate().optional(),
  query('endTimestamp').toDate().optional()

], controllers.getLayoutRecord) // obtengo el historial de layouts de la tienda

router.get('/record/:storeId/:layoutId', tokenManager.verifyAppToken, [
  param('storeId').isLength({ min: 1 }),
  param('layoutId').isLength({ min: 1 })
], controllers.getLayoutRecordById) // obtengo el historial de layouts de la tienda

router.patch('/record/:storeId/:layoutId', tokenManager.verifyAppToken, [
  param('storeId').isLength({ min: 1 }),
  param('layoutId').isLength({ min: 1 }),
  body('change_position').isBoolean()
], controllers.updateLayoutRecord) // actualizo el layout de la tienda sólo en nuestra DB

module.exports = router
