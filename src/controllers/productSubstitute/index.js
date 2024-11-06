const catchedAsync = require('../../utils/catchedAsync')

module.exports = {
  getSubstitute: catchedAsync(require('./getSubstitute')),
  getByProductId: catchedAsync(require('./getByProductId')),
  createSubstitute: catchedAsync(require('./createSubstitute'))
  // deleteSubstitute: catchedAsync(require('./deleteSubstitute')),
  // updateSubstitute: catchedAsync(require('./updateSubstitute'))
}
