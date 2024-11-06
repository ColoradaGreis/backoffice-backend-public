const catchedAsync = require('../../utils/catchedAsync')

module.exports = {
  getTree: catchedAsync(require('./getTree')),
  getAssign: catchedAsync(require('./getAssign'))
}
