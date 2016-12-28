
export default class DateHelper {
  constructor (date) {
    this._date = date
  }

  static build (date = new Date()) {
    return new this(date)
  }

  addDays (days) {
    this._date.setDate(this._date.getDate() + days)
    return this
  }

  addHours (hours) {
    this._date.setHours(this._date.getHours() + hours)
    return this
  }

  get () {
    return this._date
  }
}
