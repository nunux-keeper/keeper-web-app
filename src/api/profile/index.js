if (__PROD__) {
  module.exports = require('./ProfileApi')
} else {
  module.exports = require('./ProfileMock')
}
