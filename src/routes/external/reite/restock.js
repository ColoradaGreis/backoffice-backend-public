const express = require('express')
const { query } = require('express-validator')
const router = express.Router()
const controllers = require('../../../controllers/external/reite/restock/index')
const tokenManager = require('../../middlewares/tokenManager')

router.get('/', tokenManager.verifyAppToken, [
  query('startTimestamp').toDate().isISO8601(),
  query('endTimestamp').toDate().isISO8601()
], controllers.listRestock)

module.exports = router
