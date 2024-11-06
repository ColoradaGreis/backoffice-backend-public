const catchedAsync = require('../../utils/catchedAsync')
module.exports = {
  getStoreStock: catchedAsync(require('./getStoreStock')),
  getAllStoresStock: catchedAsync(require('./getAllStoresStock')),
  getShoppingList: catchedAsync(require('./getShoppingList')),
  downloadAllStoresStock: catchedAsync(require('./downloadAllStoresStock')),
  downloadShoppingList: catchedAsync(require('./downloadShoppingList'))
}
