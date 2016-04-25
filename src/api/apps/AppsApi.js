import AbstractApi from 'api/common/AbstractApi'

let instance = null

export default class AppsApi extends AbstractApi {
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
    return this.fetch('/profile/apps')
  }

}
