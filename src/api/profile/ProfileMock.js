import Chance from 'chance'

const chance = new Chance()

let instance = null

function getRandomProfile (_profile = {}) {
  return Object.assign(_profile, {
    hash: chance.hash({length: 15}),
    username: chance.sentence({words: 2}),
    date: chance.date()
  })
}

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
}

export default class ProfileMock {

  static getInstance (user) {
    if (!instance) {
      instance = new this(user)
    }
    return instance
  }

  get () {
    return Promise.resolve(getRandomProfile())
  }

  getApps () {
    return Promise.resolve(getRandomApps())
  }
}
