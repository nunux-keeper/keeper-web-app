if (__MOCK__) {
  module.exports = require('./LabelMock')
} else {
  module.exports = require('./LabelApi')
}
