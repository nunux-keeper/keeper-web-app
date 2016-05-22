import Chance from 'chance'

const chance = new Chance()

function getRandomDocument (doc) {
  const {
    id = chance.hash({length: 15}),
    title = chance.sentence({words: 5}),
    content = chance.paragraph({sentences: 50}),
    contentType = 'text/plain',
    origin = chance.url(),
    labels = ['test', 'badLabel'],
    share = chance.bool(),
    date = chance.date(),
    attachments = [{
      key: chance.hash({length: 10}),
      origin: chance.url({extensions: ['png']}),
      type: 'image/png'
    }]
  } = doc
  return {id, title, content, contentType, origin, share, labels, date, attachments}
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
      labels: ['test', 'badLabel'],
      share: chance.bool(),
      attachments: [{
        key: chance.hash({length: 10}),
        origin: chance.url({extensions: ['png']}),
        type: 'image/png'
      }]
    })
  }
  return result
}

export class DocumentMock {
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
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(getRandomDocument(doc))
      }, 2000)
    })
  }

  update (doc, update) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(Object.assign(doc, update))
      }, 1000)
    })
  }

  remove (doc) {
    return Promise.resolve(doc)
  }

  restore (doc) {
    return Promise.resolve(doc)
  }
}

const instance = new DocumentMock()
export default instance
