import Chance from 'chance'

const chance = new Chance()

let instance = null

function getRandomLabel (_label) {
  const {
    id = chance.hash({length: 15}),
    label = chance.sentence({words: 2}),
    color = chance.color({format: 'hex'})
  } = _label
  return {id, label, color}
}

function getRandomLabels (nb = 5) {
  const result = []

  for (let i = 0; i < nb; i++) {
    result.push(getRandomLabel({}))
  }
  return result
}

export default class LabelMock {
  static getInstance (user) {
    if (!instance) {
      instance = new this(user)
    }
    return instance
  }

  all () {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(getRandomLabels())
      }, 2000)
    })
  }

  get (id) {
    return Promise.resolve(getRandomLabel({id: id}))
  }

  create (doc) {
    return Promise.resolve(getRandomLabel(doc))
  }

  update (label, update) {
    return Promise.resolve(Object.assign(label, update))
  }

  remove (label) {
    return Promise.resolve(label)
  }

  restore (label) {
    return Promise.resolve(label)
  }
}
