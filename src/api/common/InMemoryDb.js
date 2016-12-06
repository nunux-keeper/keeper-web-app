import Chance from 'chance'

const chance = new Chance()

class InMemoryDb {
  constructor (name, options) {
    this.options = Object.assign({}, {
      nb: 5,
      createRandomItem: (obj = {}) => Object.assign({id: chance.hash({length: 15})}, obj)
    }, options)
    console.log('Init. ${name} in memory database...')
    this.db = Array.from(new Array(this.options.nb), () => this.options.createRandomItem())
  }

  get (id) {
    return this.db.find((obj) => obj.id === id)
  }

  add (obj) {
    this.db = [this.options.createRandomItem(obj), ...this.db]
    return this.db[0]
  }

  restore (obj) {
    this.db = [obj, ...this.db]
    return obj
  }

  remove (obj) {
    this.db = this.db.filter((o) => o.id !== obj.id)
    return obj
  }

  all () {
    return this.db
  }

  update (obj, update) {
    let result = null
    this.db = this.db.reduce((acc, item) => {
      if (item.id === obj.id) {
        result = Object.assign({}, item, update)
        item = result
      }
      acc.push(item)
      return acc
    }, [])
    return result
  }
}

export default InMemoryDb
