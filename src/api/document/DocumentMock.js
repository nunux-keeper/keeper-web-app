import Chance from 'chance'

const chance = new Chance()

let instance = null

function getRandomDocument (doc) {
  const {
    id = chance.hash({length: 15}),
    title = chance.sentence({words: 5}),
    content = chance.paragraph(),
    contentType = 'text/plain'
  } = doc
  return {id, title, content, contentType}
}

function getRandomDocuments (nb = 10) {
  const result = {
    total: nb,
    hits: []
  }

  for (let i = 0; i < nb; i++) {
    result.hits.push({
      id: chance.hash({length: 15}),
      title: chance.sentence({words: 5})
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
