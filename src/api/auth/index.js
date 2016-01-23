if (__PROD__) {
  module.exports = require('./AuthApi')
} else {
  module.exports = require('./AuthMock')
}
