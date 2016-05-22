import AbstractApi from 'api/common/AbstractApi'

export class ProfileApi extends AbstractApi {
  get () {
    return this.fetch('/profile')
  }
}

const instance = new ProfileApi()
export default instance
