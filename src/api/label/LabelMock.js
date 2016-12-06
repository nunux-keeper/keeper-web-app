import Chance from 'chance'
import InMemoryDb from '../common/InMemoryDb'

const chance = new Chance()

const createRandomLabel = (label = {}) => {
  return Object.assign({
    id: chance.hash({length: 15}),
    label: chance.sentence({words: 2}),
    color: chance.color({format: 'hex'})
  }, label)
}

if (!window._db_labels) {
  window._db_labels = new InMemoryDb('label', {
    nb: 0,
    createRandomItem: createRandomLabel
  })
}

export class LabelMock {
  constructor (db) {
    this.db = db
  }

  all () {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          labels: this.db.all()
        })
      }, 1000)
    })
  }

  get (id) {
    return Promise.resolve(this.db.get(id))
  }

  create (label) {
    label.id = chance.hash({length: 15})
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.db.add(label))
      }, 2000)
    })
  }

  update (label, update) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.db.update(label, update))
      }, 1000)
    })
  }

  remove (label) {
    return Promise.resolve(this.db.remove(label))
  }

  restore (label) {
    return Promise.resolve(this.db.restore(label))
  }
}

const instance = new LabelMock(window._db_labels)

export default instance

