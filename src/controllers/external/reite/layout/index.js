const catchedAsync = require('../../../../utils/catchedAsync')

module.exports = {
  listLayout: catchedAsync(require('./listLayout')),
  getLayoutById: catchedAsync(require('./getLayoutById')),
  createLayout: catchedAsync(require('./createLayout')),
  updateLayout: catchedAsync(require('./updateLayout')),
  deleteLayout: catchedAsync(require('./deleteLayout'))
}
