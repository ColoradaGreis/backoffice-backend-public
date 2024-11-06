const catchedAsync = require('../../utils/catchedAsync')
module.exports = {
  putLayoutStore: catchedAsync(require('./putLayoutStore')),
  getLayoutRecord: catchedAsync(require('./getLayoutRecord')),
  compareLayouts: catchedAsync(require('./compareLayouts')),
  getLayoutRecordById: catchedAsync(require('./getLayoutRecordById')),
  updateLayoutRecord: catchedAsync(require('./updateLayoutRecord'))
}
