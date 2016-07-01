import fetch from 'isomorphic-fetch'

export default class AbstractApi {

  buildQueryString (query) {
    if (query) {
      return '?' +
        Object.keys(query).map(function (key) {
          return encodeURIComponent(key) + '=' +
            encodeURIComponent(query[key])
        }).join('&')
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
    }).then(() => {
      headers['Authorization'] = `Bearer ${window._keycloak.token}`
      return fetch(this.resolveUrl(url, query), {method, body, headers})
      .then(response => response.json())
    })
  }
}
