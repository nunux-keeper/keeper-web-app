if (__MOCK__) {
  module.exports = require('./DocumentMock')
} else {
  module.exports = require('./DocumentApi')
}
