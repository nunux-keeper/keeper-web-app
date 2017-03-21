import AbstractApi from 'api/common/AbstractApi'

export class LabelApi extends AbstractApi {
  all (params) {
    return this.fetch('/labels')
  }

  get (id) {
    return this.fetch(`/labels/${id}`)
  }

  create (label) {
    return this.fetch('/labels', {
      method: 'post',
      body: JSON.stringify(label)
    })
  }

  update (label, update) {
    return this.fetch(`/labels/${label.id}`, {
      method: 'put',
      body: JSON.stringify(update)
    })
  }

  remove (label) {
    return this.fetch(`/labels/${label.id}`, {
      method: 'delete'
    })
  }

  restore (label) {
    return this.fetch(`/graveyard/labels/${label.id}`, {
      method: 'put'
    })
  }
}

const instance = new LabelApi()
export default instance
