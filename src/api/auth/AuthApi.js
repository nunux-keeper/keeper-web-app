import AbstractApi from '../common/AbstractApi'

let instance = null

export default class AuthApi extends AbstractApi {
  constructor () {
    super()
    this.popup = null
    this.timer = null
  }

  static getInstance () {
    if (!instance) {
      instance = new this()
    }
    return instance
  }

  login (provider) {
    if (this.popup) {
      return Promise.reject('Login popup already open.')
    }
    // Open popup login
    this.popup = window.open(this.getUrl('auth/' + provider, 'Login...', ''))
    const origin = this.getUrl()

    const login = new Promise((resolve, reject) => {
      const _listener = function (event) {
        if (event.origin !== origin) {
          return null
        }
        if (event.data) {
          window.removeEventListener('message', _listener, false)
          resolve(event.data)
        }
      }
      this.timer = setInterval(() => {
        this.popup.postMessage('token', origin)
      }, 500)
      window.addEventListener('message', _listener, false)
    })

    return login.then((token) => {
      this.popup.close()
      this.popup = null
      clearInterval(this.timer)
      return Promise.resolve(token)
    })
  }
}
