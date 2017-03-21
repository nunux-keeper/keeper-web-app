import AbstractApi from 'api/common/AbstractApi'

export class ProfileApi extends AbstractApi {
  get () {
    return this.fetch('/profiles/current')
  }
}

const instance = new ProfileApi()
export default instance
