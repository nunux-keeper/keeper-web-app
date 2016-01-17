if (__PROD__) {
  module.exports = require('./DocumentApi')
} else {
  module.exports = require('./DocumentMock')
}
