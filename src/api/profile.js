import AbstractApi from 'api/common/AbstractApi'

export class ProfileApi extends AbstractApi {
  get (query) {
    return this.fetch('/profiles/current', {query})
  }

  update (update) {
    return this.fetch('/profiles/current', {
      method: 'put',
      body: JSON.stringify(update)
    })
  }

}

const instance = new ProfileApi()
export default instance
