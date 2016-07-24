if (__MOCK__) {
  module.exports = require('./GraveyardMock')
} else {
  module.exports = require('./GraveyardApi')
}
