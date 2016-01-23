let instance = null

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmb29AYmFyIiwibmFtZSI6IkpvaG4gRG9lIn0.J0_mwi1v5lqd9smur4SOI6CP1QuZ5_so9hpjPQBLcsA'

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
