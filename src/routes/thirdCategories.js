const express = require('express')
const { query, param, body } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/thirdCategory/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/', tokenManager.verifyAppToken, [
  query('search').optional().isLength({ min: 1 }),
  query('order').optional().isIn(['DESC', 'ASC']),
  query('page').isNumeric(),
  query('limit').isNumeric()
], controllers.listThirdCategories)

router.post('/create', tokenManager.verifyAppToken, [
  body('name').isString().isLength({ min: 3, max: 50 }),
  body('second_category_id').isNumeric()
], controllers.createThirdCategory)

router.delete('/delete/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric()
], controllers.deleteThirdCategory)

router.patch('/update/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric(),
  body('name').optional().isString().isLength({ min: 3, max: 50 }),
  body('second_category_id').optional().isNumeric()
], controllers.updateThirdCategory)

router.get('/:id', tokenManager.verifyAppToken, [
  param('id').isNumeric()
], controllers.getThirdCategory)

module.exports = router
