import AbstractApi from 'api/common/AbstractApi'

export class DocumentApi extends AbstractApi {
  search (params) {
    const {q, from, size, order} = params
    return this.fetch(this.getUrl('/document', {q, from, size, order}))
  }

  get (id) {
    return this.fetch(`/document/${id}`)
  }

  create (doc) {
    return this.fetch('/document', {
      method: 'post',
      body: JSON.stringify(doc)
    })
  }

  update (doc, update) {
    return this.fetch(`/document/${doc.id}`, {
      method: 'put',
      body: JSON.stringify(update)
    })
  }

  remove (doc) {
    return this.fetch(`/document/${doc.id}`, {
      method: 'delete'
    })
  }

  restore (doc) {
    return this.fetch(`/document/${doc.id}/restore`, {
      method: 'post'
    })
  }
}

const instance = new DocumentApi()
export default instance
