const express = require('express')
const { param, query } = require('express-validator')
const router = express.Router()
const controllers = require('../../../controllers/external/reite/clients/index')
const tokenManager = require('../../middlewares/tokenManager')

router.get('/list', tokenManager.verifyAppToken, [
  query('startTimestamp').optional().toDate().isISO8601(),
  query('endTimestamp').optional().toDate().isISO8601(),
  query('limit').optional().isNumeric(),
  query('page').optional().isNumeric(),
  query('withTransactions').optional().isBoolean()

], controllers.getClientsList)

router.get('/list/download', tokenManager.verifyAppToken, [
  query('startTimestamp').optional().toDate().isISO8601(),
  query('endTimestamp').optional().toDate().isISO8601(),
  query('searchTerm').optional()
], controllers.downloadClientsList)

router.get('/:id', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 5 })
], controllers.getClientById)

module.exports = router
