if (__PROD__) {
  module.exports = require('./AppsApi')
} else {
  module.exports = require('./AppsMock')
}
