const express = require('express')
const { param, query, body } = require('express-validator')
const router = express.Router()
const controllers = require('../../../controllers/external/reite/transaction/index')
const tokenManager = require('../../middlewares/tokenManager')

router.get('/list', tokenManager.verifyAppToken, [], controllers.listTransactions)

router.patch('/:id/results', tokenManager.verifyAppToken, [
  param('id').isString().isLength({ min: 1, max: 128 }),
  body('purchased').isArray(),
  body('restocked').isArray()
], controllers.updateRestockResults)

router.get('/', tokenManager.verifyAppToken, [
  query('limit').isNumeric().optional(),
  query('startTimestamp').toDate().isISO8601(),
  query('endTimestamp').toDate().isISO8601()
], controllers.listByDate)

module.exports = router
