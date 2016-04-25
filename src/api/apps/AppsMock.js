import Chance from 'chance'

const chance = new Chance()

let instance = null

function getRandomApps () {
  const nb = chance.integer({min: 0, max: 5})
  const result = []
  for (let i = 0; i < nb; i++) {
    result.push({
      _id: chance.hash({length: 15}),
      name: chance.word(),
      homepage: chance.url()
    })
  }
  return result
}

export default class AppsMock {

  static getInstance (user) {
    if (!instance) {
      instance = new this(user)
    }
    return instance
  }

  get () {
    return Promise.resolve(getRandomApps())
  }
}
