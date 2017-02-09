import Keycloak from 'keycloak-js'

const keycloak = new Keycloak()

const facade = {
  init: () => {
    return new Promise((resolve, reject) => {
      keycloak
        .init({onLoad: 'check-sso'})
        .success(resolve)
        .error(reject)
    })
  },
  updateToken: () => {
    return new Promise((resolve, reject) => {
      keycloak
        .updateToken(30)
        .success(resolve)
        .error(reject)
    })
  },
  getToken: () => keycloak.token,
  getAccountUrl: () => keycloak.createAccountUrl(),
  getLoginUrl: () => keycloak.createLoginUrl()
}

export default facade

