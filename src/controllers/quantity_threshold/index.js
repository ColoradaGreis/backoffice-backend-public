const catchedAsync = require('../../utils/catchedAsync')

module.exports = {
  getQuantity: catchedAsync(require('./getQuantity')),
  getQuantityById: catchedAsync(require('./getQuantityById')),
  createQuantity: catchedAsync(require('./createQuantity')),
  deleteQuantity: catchedAsync(require('./deleteQuantity')),
  updateQuantity: catchedAsync(require('./updateQuantity')),
  getQuantityByProductId: catchedAsync(require('./getQuantityByProductId'))
}
