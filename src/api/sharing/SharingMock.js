import Chance from 'chance'
import InMemoryDb from '../common/InMemoryDb'

const chance = new Chance()

const createRandomSharing = (sharing = {}) => {
  return Object.assign({
    id: chance.hash({length: 15}),
    date: chance.date(),
    startDate: chance.date(),
    endDate: chance.date(),
    'public': chance.bool()
  }, sharing)
}

if (!window._db_sharing) {
  window._db_sharing = new InMemoryDb('sharing', {
    nb: 0,
    createRandomItem: createRandomSharing
  })
}

export class SharingMock {
  constructor (db) {
    this.db = db
  }

  all () {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          sharing: this.db.all()
        })
      }, 1000)
    })
  }

  get (label) {
    return Promise.resolve(this.db.get(label.sharing))
  }

  create (label, sharing) {
    sharing.id = chance.hash({length: 15})
    sharing.targetLabel = label.id
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.db.add(sharing))
      }, 2000)
    })
  }

  update (label, update) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(this.db.update({id: label.sharing}, update))
      }, 1000)
    })
  }

  remove (sharing) {
    return Promise.resolve(this.db.remove(sharing))
  }
}

const instance = new SharingMock(window._db_sharing)

export default instance

