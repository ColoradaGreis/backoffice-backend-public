const express = require('express')
const { query, param, body } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/firstCategory/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/', tokenManager.verifyAppToken, [
  query('search').optional().isLength({ min: 1 }),
  query('order').optional().isIn(['DESC', 'ASC']),
  query('page').isNumeric(),
  query('limit').isNumeric()
], controllers.listFirstCategories)

router.post('/create', tokenManager.verifyAppToken, [
  body('name').isString().isLength({ min: 3, max: 50 }),
  body('active').isBoolean().optional()
], controllers.createFirstCategory)

router.delete('/delete/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric()
], controllers.deleteFirstCategory)

router.patch('/update/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric(),
  body('name').optional().isString().isLength({ min: 3, max: 50 }),
  body('active').optional().isBoolean()
], controllers.updateFirstCategory)

router.get('/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric()
], controllers.getFirstCategory)

router.get('/:id/subcategories', [
  param('id').isNumeric()
], controllers.getSubcategories)

module.exports = router
