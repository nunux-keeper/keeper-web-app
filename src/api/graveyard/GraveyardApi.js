import AbstractApi from 'api/common/AbstractApi'

export class GraveyardApi extends AbstractApi {
  search (params) {
    const {from, size, order, label} = params
    let {q} = params
    if (label && q) {
      q = `labels:${label} AND ${q}`
    } else if (label) {
      q = `labels:${label}`
    }
    return this.fetch('/graveyard', {
      query: {q, from, size, order}
    })
  }

  empty () {
    return this.fetch('/graveyard', {
      method: 'delete'
    })
  }

  remove (doc) {
    return this.fetch(`/graveyard/${doc.id}`, {
      method: 'delete'
    })
  }
}

const instance = new GraveyardApi()
export default instance
