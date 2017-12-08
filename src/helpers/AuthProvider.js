const keycloak = new window.Keycloak(process.env.PUBLIC_URL + '/keycloak.json')

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
  getLoginUrl: (params) => keycloak.createLoginUrl(params),
  getRealmUrl: () => `${keycloak.authServerUrl}/realms/${encodeURIComponent(keycloak.realm)}`
}

export default facade

