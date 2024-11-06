const catchedAsync = require('../../utils/catchedAsync')
module.exports = {
  getAll: catchedAsync(require('./getAll')),
  getById: catchedAsync(require('./getById')),
  create: catchedAsync(require('./create')),
  update: catchedAsync(require('./update')),
  delete: catchedAsync(require('./delete')),
  getPickingOperationsByOrderId: catchedAsync(require('./getPickingOperationsByOrderId')),
  createPickingOperation: catchedAsync(require('./createPickingOperation')),
  getPickingOperationById: catchedAsync(require('./getPickingOperationById')),
  updatePickingOperation: catchedAsync(require('./updatePickingOperation')),
  deletePickingOperation: catchedAsync(require('./deletePickingOperation'))
}
