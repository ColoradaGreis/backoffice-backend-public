const catchedAsync = require('../../utils/catchedAsync')

module.exports = {
  openStore: catchedAsync(require('./openStore')),
  postInventory: catchedAsync(require('./postInventory')),
  closeStore: catchedAsync(require('./closeStore')),
  getAll: catchedAsync(require('./getAll')),
  getById: catchedAsync(require('./getById')),
  updateOperation: catchedAsync(require('./updateOperation'))
}
