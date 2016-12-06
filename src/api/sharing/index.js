if (__MOCK__) {
  module.exports = require('./SharingMock')
} else {
  module.exports = require('./SharingApi')
}
