const catchedAsync = require('../../../../utils/catchedAsync')

module.exports = {
  listTransactions: catchedAsync(require('./listTransactions')),
  updateRestockResults: catchedAsync(require('./updateRestockResults')),
  listByDate: catchedAsync(require('./listByDate'))
}
