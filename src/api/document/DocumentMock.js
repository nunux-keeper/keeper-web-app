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

function getRandomDocuments (nb = 20, total) {
  const result = {
    total: total,
    hits: []
  }

  for (let i = 0; i < nb; i++) {
    result.hits.push({
      id: chance.hash({length: 15}),
      title: chance.sentence({words: 5}),
      contentType: 'text/plain',
      origin: chance.url(),
      labels: ['test', 'titi', 'toto', 'tata', 'pouette'],
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

  search (params) {
    const {from, size} = params
    return new Promise((resolve) => {
      window.setTimeout(() => {
        if (from) {
          resolve(getRandomDocuments(7, size + 7))
        } else {
          resolve(getRandomDocuments(size, size + 7))
        }
      }, 2000)
    })
  }

  get (id) {
    return Promise.resolve(getRandomDocument({id: id}))
  }

  create (doc) {
    return Promise.resolve(getRandomDocument(doc))
  }

  update (doc, update) {
    return Promise.resolve(Object.assign(doc, update))
  }

  remove (doc) {
    return Promise.resolve(doc)
  }

  restore (doc) {
    return Promise.resolve(doc)
  }
}
