const catchedAsync = require('../../utils/catchedAsync')
module.exports = {
  singUp: catchedAsync(require('./signUp')),
  login: catchedAsync(require('./login')),
  getAll: catchedAsync(require('./getAll')),
  getById: catchedAsync(require('./getById')),
  updateUser: catchedAsync(require('./updateUser')),
  updatePassword: catchedAsync(require('./updatePassword')),
  deleteUser: catchedAsync(require('./deleteUser')),
  downloadExcel: catchedAsync(require('./downloadExcel'))
}
