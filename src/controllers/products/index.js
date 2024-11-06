const catchedAsync = require('../../utils/catchedAsync')

module.exports = {
  listProducts: catchedAsync(require('./listProducts')),
  getProduct: catchedAsync(require('./getProduct')),
  findProduct: catchedAsync(require('./findProduct')),
  createProduct: catchedAsync(require('./createProduct')),
  updateProduct: catchedAsync(require('./updateProduct')),
  updateProductImage: catchedAsync(require('./updateProductImage')),
  deleteProduct: catchedAsync(require('./deleteProduct')),
  generatePDF: catchedAsync(require('./generatePDF'))
}
