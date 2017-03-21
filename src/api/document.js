import AbstractApi from 'api/common/AbstractApi'

export class DocumentApi extends AbstractApi {
  search (params) {
    const {from, size, order, label} = params
    let {q} = params
    if (label && q) {
      q = `labels:${label} AND ${q}`
    } else if (label) {
      q = `labels:${label}`
    }
    return this.fetch('/documents', {
      query: {q, from, size, order}
    })
  }

  searchShared (params) {
    const {q, from, size, order, sharingId} = params
    return this.fetch(`/sharing/${sharingId}`, {
      query: {q, from, size, order}
    })
  }

  searchPublic (params) {
    const {q, from, size, order, sharingId} = params
    return this.fetch(`/public/${sharingId}`, {
      query: {q, from, size, order},
      credentials: 'none'
    })
  }

  get (id) {
    return this.fetch(`/documents/${id}`)
  }

  getShared (id, sharingId) {
    return this.fetch(`/sharing/${sharingId}/${id}`)
  }

  getPublic (id, sharingId) {
    return this.fetch(`/public/${sharingId}/${id}`, {
      credentials: 'none'
    })
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
