import Chance from 'chance'
import GraveyardMock from 'api/graveyard'

const chance = new Chance()

const getRandomDocument = (doc = {}) => {
  return Object.assign({
    id: chance.hash({length: 15}),
    title: chance.sentence({words: 5}),
    content: chance.paragraph({sentences: 50}),
    contentType: 'text/plain',
    origin: chance.url(),
    labels: ['test', 'badLabel'],
    share: chance.bool(),
    date: chance.date(),
    attachments: [{
      key: chance.hash({length: 10}),
      origin: chance.url({extensions: ['png']}),
      type: 'image/png'
    }]
  }, doc)
}

class DocumentInMemoryDb {
  constructor (nb = 25) {
    console.log('Init. document in memory database...', nb)
    this.db = []
    for (let i = 0; i < nb; i++) {
      this.db.push(getRandomDocument())
    }
  }

  get (id) {
    return this.db.find((d) => d.id === id)
  }

  add (doc) {
    const newDoc = getRandomDocument(doc)
    this.db = [newDoc, ...this.db]
    return newDoc
  }

  restore (doc) {
    this.db = [doc, ...this.db]
    return doc
  }

  remove (doc) {
    this.db = this.db.filter((d) => d.id !== doc.id)
    return doc
  }

  search (from = 0, size = 20) {
    return {
      total: this.db.length,
      hits: this.db.slice(from * size, (from * size) + size)
    }
  }

  update (doc, update) {
    let result = null
    this.db = this.db.reduce((acc, item) => {
      if (item.id === doc.id) {
        result = Object.assign({}, item, update)
        item = result
      }
      acc.push(item)
      return acc
    }, [])
    return result
  }
}

if (!window._db_documents) {
  window._db_documents = new DocumentInMemoryDb()
}

export class DocumentMock {
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

  get (id) {
    return Promise.resolve(this.db.get(id))
  }

  create (doc) {
    doc.id = chance.hash({length: 15})
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.db.add(doc))
      }, 2000)
    })
  }

  update (doc, update) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.db.update(doc, update))
      }, 1000)
    })
  }

  remove (doc) {
    return GraveyardMock.add(doc)
    .then(() => Promise.resolve(this.db.remove(doc)))
  }

  restore (doc) {
    return GraveyardMock.remove(doc)
    .then(() => Promise.resolve(this.db.restore(doc)))
  }
}

const instance = new DocumentMock(window._db_documents)
export default instance
