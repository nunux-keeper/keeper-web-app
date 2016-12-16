let impl

if (process.env.MOCK === 'true') {
  impl = require('./GraveyardMock')
} else {
  impl = require('./GraveyardApi')
}

module.exports = impl
