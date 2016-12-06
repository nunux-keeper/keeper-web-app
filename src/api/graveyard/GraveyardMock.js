import InMemoryDb from '../common/InMemoryDb'

class GraveyardInMemoryDb extends InMemoryDb {
  constructor () {
    super('graveyard', {nb: 0})
  }
  search (from = 0, size = 20) {
    return {
      total: this.db.length,
      hits: this.db.slice(from * size, (from * size) + size)
    }
  }

  clear () {
    this.db = []
    return null
  }
}

if (!window._db_graveyard) {
  window._db_graveyard = new GraveyardInMemoryDb()
}

export class GraveyardMock {
  constructor (db) {
    this.db = db
  }

  search (params) {
    const {from, size} = params
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.db.search(from, size))
      }, 2000)
    })
  }

  empty () {
    return Promise.resolve(this.db.clear())
  }

  add (doc) {
    // only used by DocumentMock
    return Promise.resolve(this.db.add(doc))
  }

  remove (doc) {
    return Promise.resolve(this.db.remove(doc))
  }
}

const instance = new GraveyardMock(window._db_graveyard)
export default instance
