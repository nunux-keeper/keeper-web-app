import Chance from 'chance'

const chance = new Chance()

const getRandomLabel = (label = {}) => {
  return Object.assign({
    id: chance.hash({length: 15}),
    label: chance.sentence({words: 2}),
    color: chance.color({format: 'hex'})
  }, label)
}

class LabelInMemoryDb {
  constructor (nb = 5) {
    console.log('Init. label in memory database...', nb)
    this.db = []
    this.db.push({id: 'test', label: 'test', color: '#F2711C'})
    for (let i = 0; i < nb - 1; i++) {
      this.db.push(getRandomLabel())
    }
  }

  get (id) {
    return this.db.find((d) => d.id === id)
  }

  add (label) {
    const newLabel = getRandomLabel(label)
    this.db = [newLabel, ...this.db]
    return newLabel
  }

  restore (label) {
    this.db = [label, ...this.db]
    return label
  }

  remove (label) {
    this.db = this.db.filter((l) => l.id !== label.id)
    return label
  }

  all () {
    return this.db
  }

  update (label, update) {
    let result = null
    this.db = this.db.reduce((acc, item) => {
      if (item.id === label.id) {
        result = Object.assign({}, item, update)
        item = result
      }
      acc.push(item)
      return acc
    }, [])
    return result
  }
}

if (!window._db_labels) {
  window._db_labels = new LabelInMemoryDb()
}

export class LabelMock {
  constructor (db) {
    this.db = db
  }

  all () {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.db.all())
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

  remove (doc) {
    return Promise.resolve(this.db.remove(doc))
  }

  restore (doc) {
    return Promise.resolve(this.db.restore(doc))
  }
}

const instance = new LabelMock(window._db_labels)

export default instance

