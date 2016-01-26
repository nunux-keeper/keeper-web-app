import Chance from 'chance'

const chance = new Chance()

let instance = null

function getRandomDocument (doc) {
  const {
    id = chance.hash({length: 15}),
    title = chance.sentence({words: 5}),
    content = chance.paragraph({sentences: 50}),
    contentType = 'text/plain',
    origin = chance.url(),
    labels = ['test'],
    date = chance.date(),
    attachments = [{
      key: chance.hash({length: 10}),
      origin: chance.url({extensions: ['png']}),
      type: 'image/png'
    }]
  } = doc
  return {id, title, content, contentType, origin, labels, date, attachments}
}

function getRandomDocuments (nb = 10) {
  const result = {
    total: nb,
    hits: []
  }

  for (let i = 0; i < nb; i++) {
    result.hits.push({
      id: chance.hash({length: 15}),
      title: chance.sentence({words: 5}),
      contentType: 'text/plain',
      origin: chance.url(),
      labels: ['test'],
      attachments: [{
        key: chance.hash({length: 10}),
        origin: chance.url({extensions: ['png']}),
        type: 'image/png'
      }]
    })
  }
  return result
}

export default class DocumentMock {
  static getInstance (user) {
    if (!instance) {
      instance = new this(user)
    }
    return instance
  }

  search (/* params */) {
    return Promise.resolve(getRandomDocuments())
  }

  get (id) {
    return Promise.resolve(getRandomDocument({id: id}))
  }

  create (doc) {
    return Promise.resolve(getRandomDocument(doc))
  }

  update (id, update) {
    var doc = Object.assign({id}, update)
    return Promise.resolve(getRandomDocument(doc))
  }

  remove (id) {
    return Promise.resolve(getRandomDocument({id: id}))
  }

  restore (id) {
    return Promise.resolve(getRandomDocument({id: id}))
  }
}
