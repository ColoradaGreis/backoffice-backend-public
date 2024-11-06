const catchedAsync = require('../../utils/catchedAsync')
module.exports = {
  auth: catchedAsync(require('./auth')),
  reiteWebhook: catchedAsync(require('./reiteWebhook')),
  external_notification: catchedAsync(require('./external_notification')),
  read: catchedAsync(require('./read')),
  delete: catchedAsync(require('./delete')),
  noRead: catchedAsync(require('./noRead'))
}
