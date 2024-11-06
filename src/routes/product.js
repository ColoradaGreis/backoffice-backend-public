const express = require('express')
const { query, body, param } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/products/index')
const tokenManager = require('./middlewares/tokenManager')
// const multer = require('multer')
// const upload = multer({
//   limits: {
//     fieldSize: 8 * 1024 * 1024
//   }
// })

router.get('/list', tokenManager.verifyAppToken, [
  query('search').optional().isLength({ min: 1 }),
  query('order').optional().isIn(['DESC', 'ASC']),
  query('page').isNumeric(),
  query('limit').isNumeric()
], controllers.listProducts)

router.get('/', tokenManager.verifyAppToken, [
  query('id').isLength({ min: 1 })
], controllers.getProduct)

router.get('/find', tokenManager.verifyAppToken, [
  query('ean').isLength({ min: 1 })
], controllers.findProduct)

router.post('/create', tokenManager.verifyAppToken, [
  body('ean').optional().isLength({ min: 1 }),
  body('sku_sap').optional().isLength({ min: 1 }),
  body('sku_vtex').optional().isLength({ min: 1 }),
  body('short_name').isLength({ min: 1 }),
  body('long_name').isLength({ min: 1 }),
  body('measure_unit').isLength({ min: 1 }),
  body('content_detail').isInt({ min: 1 }),
  body('brand').optional().isLength({ min: 1 }),
  body('proxy_duration').optional().isLength({ min: 1 }),
  body('pack').optional(),
  body('generated_ean').optional().isBoolean(),
  body('autoshoppable_available').optional().isBoolean(),
  body('first_category').isNumeric().toInt(),
  body('second_category').isNumeric().toInt(),
  body('third_category').isNumeric().toInt()
], controllers.createProduct)

router.patch('/update', tokenManager.verifyAppToken, [
  body('id').isLength({ min: 1 }),
  body('sku_sap'),
  body('sku_vtex'),
  body('short_name').isLength({ min: 1 }),
  body('long_name').isLength({ min: 1 }),
  body('measure_unit').isLength({ min: 1 }),
  body('content_detail').isInt({ min: 1 }),
  body('brand').isLength({ min: 1 }),
  body('proxy_duration').isLength({ min: 1 }),
  body('pack'),
  body('generated_ean').isBoolean(),
  body('autoshoppable_available').isBoolean(),
  body('first_category').isNumeric().toInt(),
  body('second_category').isNumeric().toInt(),
  body('third_category').isNumeric().toInt()
], controllers.updateProduct)

// router.put('/update-image', tokenManager.verifyAppToken, upload.single('image'), [
//   body('id').isLength({ min: 1 })
// ], controllers.updateProductImage)

router.delete('/delete', tokenManager.verifyAppToken, [
  body('id').isLength({ min: 1 })
], controllers.deleteProduct)

router.get('/:id/generate-pdf', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 1 })
], controllers.generatePDF)

module.exports = router
