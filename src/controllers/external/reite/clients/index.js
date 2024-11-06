const catchedAsync = require('../../../../utils/catchedAsync')

module.exports = {
  getClientsList: catchedAsync(require('./getClientsList')),
  downloadClientsList: catchedAsync(require('./downloadClientsList')),
  getClientById: catchedAsync(require('./getClientById'))
}
