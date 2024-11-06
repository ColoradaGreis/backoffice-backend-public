const catchedAsync = require('../../utils/catchedAsync')
module.exports = {
  getStores: catchedAsync(require('./getStores')),
  downloadInventory: catchedAsync(require('./downloadInventory')),
  getTransitionLayouts: catchedAsync(require('./getTransitionLayouts')),
  updateLayoutStore: catchedAsync(require('./updateLayoutStore')),
  saveLayoutStore: catchedAsync(require('./saveLayoutStore'))
}
