import Chance from 'chance'

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

class InMemoryDb {
  constructor (nb = 25) {
    console.log('Init. in memory database...', nb)
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

if (!window._db) {
  window._db = new InMemoryDb()
}

export class DocumentMock {
  search (params) {
    const {from, size} = params
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(window._db.search(from, size))
      }, 2000)
    })
  }

  get (id) {
    return Promise.resolve(window._db.get(id))
  }

  create (doc) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(window._db.add(doc))
      }, 2000)
    })
  }

  update (doc, update) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(window._db.update(doc, update))
      }, 1000)
    })
  }

  remove (doc) {
    return Promise.resolve(window._db.remove(doc))
  }

  restore (doc) {
    return Promise.resolve(window._db.restore(doc))
  }
}

const instance = new DocumentMock()
export default instance
