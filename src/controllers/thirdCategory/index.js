const catchedAsync = require('../../utils/catchedAsync')

module.exports = {
  listThirdCategories: catchedAsync(require('./listThirdCategories.js')),
  createThirdCategory: catchedAsync(require('./createThirdCategory.js')),
  deleteThirdCategory: catchedAsync(require('./deleteThirdCategory.js')),
  updateThirdCategory: catchedAsync(require('./updateThirdCategory.js')),
  getThirdCategory: catchedAsync(require('./getThirdCategory.js'))
}
