const catchedAsync = require('../../../../utils/catchedAsync')

module.exports = {
  listProducts: catchedAsync(require('./listProducts')),
  getProductById: catchedAsync(require('./getProductById')),
  noMatched: catchedAsync(require('./noMatched')),
  updatePrice: catchedAsync(require('./updatePrice'))
}
