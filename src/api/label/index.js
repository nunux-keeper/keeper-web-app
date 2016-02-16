if (__PROD__) {
  module.exports = require('./LabelApi')
} else {
  module.exports = require('./LabelMock')
}
