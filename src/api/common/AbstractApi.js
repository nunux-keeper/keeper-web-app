import fetch from 'isomorphic-fetch'

export default class AbstractApi {
  constructor () {
    this.firstCall = true
  }

  buildQueryString (query) {
    if (query) {
      const params = Object.keys(query).reduce((acc, key) => {
        if (query[key]) {
          acc.push(
            encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
          )
        }
        return acc
      }, [])
      return params.length ? '?' + params.join('&') : ''
    } else {
      return ''
    }
  }

  resolveUrl (url, query) {
    return window.API_ROOT + url + this.buildQueryString(query)
  }

  fetch (url, params) {
    params = Object.assign({
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }, params)
    const {method, body, headers, query} = params

    return new Promise((resolve, reject) => {
      window._keycloak.updateToken(30).success(resolve).error(reject)
    }).then((updated) => {
      if (updated || this.firstCall) {
        // Token was updated or it's the first API call.
        // Authorization header is set in order to update the API cookie.
        headers['Authorization'] = `Bearer ${window._keycloak.token}`
        this.firstCall = false
      }
      return fetch(this.resolveUrl(url, query), {method, body, headers})
      .then(response => response.json())
    })
  }
}
