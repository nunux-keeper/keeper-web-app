if (__MOCK__) {
  module.exports = require('./ProfileMock')
} else {
  module.exports = require('./ProfileApi')
}
