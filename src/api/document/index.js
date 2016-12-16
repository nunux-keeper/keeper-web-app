let impl

if (process.env.MOCK === 'true') {
  impl = require('./DocumentMock')
} else {
  impl = require('./DocumentApi')
}

module.exports = impl
