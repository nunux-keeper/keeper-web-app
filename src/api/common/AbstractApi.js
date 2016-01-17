import fetch from 'isomorphic-fetch'

export default class AbstractApi {
  constructor (user) {
    this.user = user
  }

  getUrl (url, params) {
    return url + '?' +
      Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' +
          encodeURIComponent(params[key])
      }).join('&')
  }

  fetch (url, params = {method: 'get', body, headers: {}}) {
    const {method, body, headers} = params
    headers.Accept = 'application/json'
    headers['Content-Type'] = 'application/json'
    if (this.user && this.user.token) {
      headers['X-Api-Token'] = this.user.token
    }

    return fetch(url, {method, body, headers})
    .then(response => response.json())
  }
}
