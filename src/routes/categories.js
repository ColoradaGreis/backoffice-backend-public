const express = require('express')
const { query } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/categories/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/tree', tokenManager.verifyAppToken, [
  query('search').optional().isLength({ min: 1 }),
  query('order').optional().isIn(['DESC', 'ASC']),
  query('page').isNumeric(),
  query('limit').isNumeric()
], controllers.getTree)

router.get('/assign', tokenManager.verifyAppToken, [
  query('thirdCategoryId').isNumeric()
], controllers.getAssign)

module.exports = router
