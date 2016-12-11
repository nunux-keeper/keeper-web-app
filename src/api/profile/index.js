let impl

if (process.env.MOCK === 'true') {
  impl = require('./ProfileMock')
} else {
  impl = require('./ProfileApi')
}

module.exports = impl
