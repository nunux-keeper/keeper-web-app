let impl

if (process.env.MOCK === 'true') {
  impl = require('./LabelMock')
} else {
  impl = require('./LabelApi')
}

module.exports = impl
