import AbstractApi from 'api/common/AbstractApi'

let instance = null

export default class LabelApi extends AbstractApi {
  constructor (user) {
    super(user)
  }

  static getInstance (user) {
    if (!instance) {
      instance = new this(user)
    }
    return instance
  }

  all (params) {
    return this.fetch('/label')
  }

  get (id) {
    return this.fetch(`/label/${id}`)
  }

  create (label) {
    return this.fetch('/label', {
      method: 'post',
      body: JSON.stringify(label)
    })
  }

  update (label, update) {
    return this.fetch(`/label/${label.id}`, {
      method: 'put',
      body: JSON.stringify(update)
    })
  }

  remove (label) {
    return this.fetch(`/label/${label.id}`, {
      method: 'delete'
    })
  }

  restore (label) {
    return this.fetch(`/document/${label.id}/restore`, {
      method: 'post'
    })
  }
}
