import fetch from 'isomorphic-fetch'

export default class AbstractApi {

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

    return new Promise((resolve, reject) => {
      window._keycloak.updateToken(30).success(resolve).error(reject)
    }).then(() => {
      headers['Authorization'] = `Bearer ${window._keycloak.token}`
      return fetch(url, {method, body, headers})
      .then(response => response.json())
    })
  }
}
