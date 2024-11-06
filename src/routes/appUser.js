const express = require('express')
const { body, param } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/appUser/index')
const tokenManager = require('./middlewares/tokenManager')

router.post('/signup', tokenManager.verifyAppToken, [
  body('email').isEmail(),
  body('password').optional().isLength({ min: 7 }),
  body('role').optional().isIn(['admin', 'restock', 'read']),
  body('first_name').optional().isLength({ min: 1, max: 255 }),
  body('middle_name').optional().isLength({ min: 1, max: 255 }),
  body('first_lastname').optional().isLength({ min: 1, max: 255 }),
  body('second_lastname').optional().isLength({ min: 1, max: 255 })
], controllers.singUp)

router.post('/login', [
  body('email').isEmail().normalizeEmail({ all_lowercase: true, gmail_remove_dots: false }), body('password').isLength({ min: 8 })
], controllers.login)

router.get('/', tokenManager.verifyAppToken, controllers.getAll)

router.get('/:userId', tokenManager.verifyAppToken, [
  param('userId').isNumeric()
], controllers.getById)

router.put('/update', tokenManager.verifyAppToken, [
  body('id').isLength({ min: 1 }),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['admin', 'restock', 'read']),
  body('first_name').optional().isLength({ min: 1, max: 255 }),
  body('middle_name').optional().isLength({ min: 1, max: 255 }),
  body('first_lastname').optional().isLength({ min: 1, max: 255 }),
  body('second_lastname').optional().isLength({ min: 1, max: 255 })
], controllers.updateUser)

router.put('/update-password', tokenManager.verifyAppToken, [
  body('email').isEmail(),
  body('password').isLength({ min: 7 })
], controllers.updatePassword)

router.delete('/delete', tokenManager.verifyAppToken, [
  body('id').isLength({ min: 1 }),
  body('email').isEmail()
], controllers.deleteUser)

router.get('/download/excel', tokenManager.verifyAppToken, controllers.downloadExcel)

module.exports = router
