const catchedAsync = require('../../../../utils/catchedAsync')

module.exports = {
  getStores: catchedAsync(require('./getStores')),
  getStoreInventory: catchedAsync(require('./getStoreInventory')),
  getStoresStock: catchedAsync(require('./getStoresStock')),
  getStoreProducts: catchedAsync(require('./getStoreProducts')),
  OpenStore: catchedAsync(require('./OpenStore')),
  updateStoreInventory: catchedAsync(require('./updateStoreInventory')),
  getStoreById: catchedAsync(require('./getStoreById')),
  updateLayoutStore: catchedAsync(require('./updateLayoutStore'))
}
