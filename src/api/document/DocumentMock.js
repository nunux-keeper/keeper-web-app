import Chance from 'chance'
import InMemoryDb from '../common/InMemoryDb'
import GraveyardMock from 'api/graveyard'

const chance = new Chance()

const createRandomDocument = (doc = {}) => {
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

if (!window._db_documents) {
  window._db_documents = new InMemoryDb('document', {
    nb: 25,
    createRandomItem: createRandomDocument
  })
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
