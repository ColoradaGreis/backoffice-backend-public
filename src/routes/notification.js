const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const controllers = require('../controllers/notification/index')
const externalNotification = require('../controllers/notification/external_notification')
router.post('/auth', [
  body('email').isEmail(), body('password').isLength({ min: 8 })
], controllers.auth)
/*
router.post('/send', [], async function (req, res, next) {
  const reqErrors = validationResult(req);
  if (!reqErrors.isEmpty()) {
    return res.status(422).json({ errors: reqErrors.array() });
  }
  try {
    req.body.type = 'notification';
    const result = await notificationManager.create(req.body);
    if (result) {
      return res.json(result);
    }
    return res.status(400).json({ error: 'error' });
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});
*/
router.post('/reite/webhook/RdtfLQYiAUAvDntbFEHZEWbiIHQSGYqt', [
], controllers.reiteWebhook)

router.post('/notify/Kac4b9Rt3u1aI2k6Gd7e0r8Nl5o2Rt1V', externalNotification.notify)

router.post('/client/notify/PmK9lA3jF7oZqR2tW8sX5cV1bG4mN6yH', externalNotification.clientNotify)

router.post('/transaction/notify/u4Y8aD2vE5wV9sC1bG3mN6zQ7xJ0kL2p', externalNotification.transactionNotify)

router.get('/subscribe/:id', externalNotification.subscribe)

router.put('/read/:id', controllers.read)

router.delete('/:id', controllers.delete)

router.delete('/noRead/:id', controllers.noRead)

module.exports = router
