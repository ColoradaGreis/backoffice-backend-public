const catchedAsync = require('../../utils/catchedAsync')

module.exports = {
  listSecondCategories: catchedAsync(require('./listSecondCategories.js')),
  createSecondCategory: catchedAsync(require('./createSecondCategory.js')),
  deleteSecondCategory: catchedAsync(require('./deleteSecondCategory.js')),
  updateSecondCategory: catchedAsync(require('./updateSecondCategory.js')),
  getSecondCategory: catchedAsync(require('./getSecondCategory.js')),
  getSubcategories: catchedAsync(require('./getSubcategories.js'))
}
