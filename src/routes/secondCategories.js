const express = require('express')
const { query, param, body } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/secondCategory/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/', tokenManager.verifyAppToken, [
  query('search').optional().isLength({ min: 1 }),
  query('order').optional().isIn(['DESC', 'ASC']),
  query('page').isNumeric(),
  query('limit').isNumeric()
], controllers.listSecondCategories)

router.post('/create', tokenManager.verifyAppToken, [
  body('name').isString().isLength({ min: 3, max: 50 }),
  body('first_category_id').isNumeric()
], controllers.createSecondCategory)

router.delete('/delete/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric()
], controllers.deleteSecondCategory)

router.patch('/update/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric(),
  body('name').optional().isString().isLength({ min: 3, max: 50 }),
  body('first_category_id').optional().isNumeric()
], controllers.updateSecondCategory)

router.get('/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric()
], controllers.getSecondCategory)

router.get('/:id/subcategories', tokenManager.verifyAppToken, [
  param('id').isNumeric()
], controllers.getSubcategories)

module.exports = router
