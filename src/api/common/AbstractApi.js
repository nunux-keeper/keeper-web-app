import fetch from 'isomorphic-fetch'
import authProvider from 'helpers/AuthProvider'

export default class AbstractApi {
  constructor () {
    this.firstCall = true
    this.apiRoot = process.env.REACT_APP_API_ROOT
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
    return this.apiRoot + url + this.buildQueryString(query)
  }

  fetch (url, params) {
    params = Object.assign({
      method: 'get',
      headers: {
        Accept: 'application/json'
      },
      credentials: 'include'
    }, params)
    const {method, body, headers, query, credentials} = params
    if (method === 'post' || method === 'put' || method === 'patch') {
      headers['Content-Type'] = 'application/json'
    }

    let authz = Promise.resolve()
    if (params.credentials !== 'none') {
      authz = authProvider.updateToken().then((updated) => {
        if (updated || this.firstCall) {
          // Token was updated or it's the first API call.
          // Authorization header is set in order to update the API cookie.
          headers['Authorization'] = `Bearer ${authProvider.getToken()}`
          this.firstCall = false
        }
        return Promise.resolve()
      }, (err) => {
        // Fatal error from keycloak server. Mainly due to CORS.
        // Forced to reload the page.
        // FIXME Find a better way to handle Keycloak errors.
        console.error('Fatal error when updating the token', err)
        location.reload()
      })
    }

    const _url = this.resolveUrl(url, query)
    return authz.then(() => fetch(_url, {method, body, headers, credentials}))
      .then(response => {
        if (response.status === 204 || response.status === 205) {
          return Promise.resolve()
        } else if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          return response.json().then((err) => Promise.reject(err))
        }
      })
  }
}
