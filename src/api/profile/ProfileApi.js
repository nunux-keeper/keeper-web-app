import AbstractApi from 'api/common/AbstractApi'

let instance = null

export default class ProfileApi extends AbstractApi {
  constructor (user) {
    super(user)
  }

  static getInstance (user) {
    if (!instance) {
      instance = new this(user)
    }
    return instance
  }

  get () {
    return this.fetch('/profile')
  }
}
