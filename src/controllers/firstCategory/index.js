const catchedAsync = require('../../utils/catchedAsync')

module.exports = {
  listFirstCategories: catchedAsync(require('./listFirstCategories.js')),
  createFirstCategory: catchedAsync(require('./createFirstCategory.js')),
  deleteFirstCategory: catchedAsync(require('./deleteFirstCategory.js')),
  updateFirstCategory: catchedAsync(require('./updateFirstCategory.js')),
  getFirstCategory: catchedAsync(require('./getFirstCategory.js')),
  getSubcategories: catchedAsync(require('./getSubcategories.js'))
}
