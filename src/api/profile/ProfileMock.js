import Chance from 'chance'

const chance = new Chance()

function getRandomProfile (_profile = {}) {
  return Object.assign(_profile, {
    hash: chance.hash({length: 15}),
    username: chance.sentence({words: 2}),
    date: chance.date()
  })
}

export class ProfileMock {
  get () {
    return Promise.resolve(getRandomProfile())
  }
}

const instance = new ProfileMock()

export default instance
