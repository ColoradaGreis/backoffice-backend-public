const express = require('express')
const { param, body } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/productSubstitute/index')
const tokenManager = require('./middlewares/tokenManager')

router.get('/', tokenManager.verifyAppToken, [
], controllers.getSubstitute)

router.get('/:originalProductId', tokenManager.verifyAppToken, [
  param('originalProductId').isNumeric()
], controllers.getByProductId)

router.post('/create', tokenManager.verifyAppToken, [
  body('original_product_id').isNumeric(),
  body('replacement_product_id').isNumeric(),
  body('assignment_order').isNumeric()
], controllers.createSubstitute)

// router.delete('/delete/:id', [
//   param('id').isNumeric()
// ], controllers.deleteCategory)

// router.put('/update/:id', [
//   param('id').isNumeric(),
//   body('name').optional().isString().isLength({ min: 3, max: 50 }),
//   body('active').optional().isBoolean()
// ], controllers.updateCategory)

module.exports = router
