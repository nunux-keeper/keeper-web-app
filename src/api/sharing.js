import AbstractApi from 'api/common/AbstractApi'

export class SharingApi extends AbstractApi {
  all (params) {
    return this.fetch('/sharing')
  }

  get (label) {
    return this.fetch(`/labels/${label.id}/sharing`)
  }

  create (label, sharing) {
    return this.fetch(`/labels/${label.id}/sharing`, {
      method: 'post',
      body: JSON.stringify(sharing)
    })
  }

  update (label, update) {
    return this.fetch(`/labels/${label.id}/sharing`, {
      method: 'put',
      body: JSON.stringify(update)
    })
  }

  remove (label) {
    return this.fetch(`/labels/${label.id}/sharing`, {
      method: 'delete'
    })
  }
}

const instance = new SharingApi()
export default instance
