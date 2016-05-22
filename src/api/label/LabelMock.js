import Chance from 'chance'

const chance = new Chance()

function getRandomLabel (_label) {
  const {
    id = chance.hash({length: 15}),
    label = chance.sentence({words: 2}),
    color = chance.color({format: 'hex'})
  } = _label
  return {id, label, color}
}

function getRandomLabels (nb = 5) {
  const result = [
    {id: 'test', label: 'test', color: '#F2711C'}
  ]

  for (let i = 0; i < nb; i++) {
    result.push(getRandomLabel({}))
  }
  return result
}

export class LabelMock {
  constructor () {
    this.db = []
  }

  all () {
    if (this.db.length) {
      return Promise.resolve(this.db)
    }
    return new Promise((resolve) => {
      window.setTimeout(() => {
        this.db = getRandomLabels()
        resolve(this.db)
      }, 2000)
    })
  }

  get (id) {
    let _label = null
    this.db.forEach((item) => {
      if (item.id === id) {
        _label = item
      }
    })
    return Promise.resolve(_label)
  }

  create (label) {
    const _label = getRandomLabel(label)
    this.db.push(_label)
    return Promise.resolve(_label)
  }

  update (label, update) {
    const _label = Object.assign(label, update)
    this.db.forEach((item, index, array) => {
      if (item.id === _label.id) {
        array[index] = _label
      }
    })
    return Promise.resolve(_label)
  }

  remove (label) {
    this.removed = label
    this.db = this.db.filter((l) => l.id !== label.id)
    return Promise.resolve(label)
  }

  restore (label) {
    this.db.push(label)
    return Promise.resolve(label)
  }
}

const instance = new LabelMock()
export default instance
