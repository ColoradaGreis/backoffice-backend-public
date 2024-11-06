const express = require('express')
const { param, body } = require('express-validator')
const router = express.Router()

const controllers = require('../../../controllers/external/reite/layout')
const tokenManager = require('../../middlewares/tokenManager')

router.get('/list', tokenManager.verifyAppToken, [], controllers.listLayout)

router.get('/:id', tokenManager.verifyAppToken, [param('id').isLength({ min: 5 })], controllers.getLayoutById)

router.post('/', tokenManager.verifyAppToken, [
  body('name').isLength({ min: 5 }),
  body('layout').isArray()
], controllers.createLayout)

router.put('/:id', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 5 }),
  body('name').isLength({ min: 5 }),
  body('layout').isArray(),
  body('prices').isObject()
], controllers.updateLayout)

router.delete('/:id', tokenManager.verifyAppToken, [
  param('id').isLength({ min: 5 })
], controllers.deleteLayout)

module.exports = router
