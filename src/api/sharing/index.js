let impl

if (process.env.MOCK === 'true') {
  impl = require('./SharingMock')
} else {
  impl = require('./SharingApi')
}

module.exports = impl
