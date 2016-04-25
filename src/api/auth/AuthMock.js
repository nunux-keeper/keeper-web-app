let instance = null

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'

export default class AuthMock {
  static getInstance () {
    if (!instance) {
      instance = new this()
    }
    return instance
  }

  login (/* provider */) {
    return Promise.resolve(TOKEN)
  }
}
