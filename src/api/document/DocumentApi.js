import AbstractApi from 'api/common/AbstractApi'

export class DocumentApi extends AbstractApi {
  search (params) {
    const {from, size, order, label, sharing} = params
    let {q} = params
    if (label && q) {
      q = `labels:${label} AND ${q}`
    } else if (label) {
      q = `labels:${label}`
    }
    const url = sharing ? `/sharing/${sharing}` : '/documents'
    return this.fetch(url, {
      query: {q, from, size, order}
    })
  }

  get (id, sharing) {
    return sharing
      ? this.fetch(`/sharing/${sharing}/${id}`)
      : this.fetch(`/documents/${id}`)
  }

  create (doc) {
    return this.fetch('/documents', {
      method: 'post',
      body: JSON.stringify(doc)
    })
  }

  update (doc, update) {
    return this.fetch(`/documents/${doc.id}`, {
      method: 'put',
      body: JSON.stringify(update)
    })
  }

  remove (doc) {
    return this.fetch(`/documents/${doc.id}`, {
      method: 'delete'
    })
  }

  restore (doc) {
    return this.fetch(`/graveyard/documents/${doc.id}`, {
      method: 'put'
    })
  }
}

const instance = new DocumentApi()
export default instance
