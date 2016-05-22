import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const INIT_AUTH = 'INIT_AUTH'

// ------------------------------------
// Actions
// ------------------------------------
export const initAuthenticationRequest = createAction(INIT_AUTH)
export const initAuthenticationFailure = createAction(INIT_AUTH, (err) => {
  return { error: err }
})
export const initAuthenticationSuccess = createAction(INIT_AUTH, (authenticated) => {
  return { authenticated }
})

export const initAuthentication = () => {
  return (dispatch, getState) => {
    const {auth} = getState()
    dispatch(initAuthenticationRequest())
    return new Promise(function (resolve, reject) {
      auth.keycloak.init({ onLoad: 'login-required' }).success((authenticated) => {
        resolve(dispatch(initAuthenticationSuccess(authenticated)))
      }).error((e) => {
        reject(dispatch(initAuthenticationFailure(e)))
      })
    })
  }
}

export const actions = {
  initAuthentication
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [INIT_AUTH]: (state, action) => {
    const update = {
      isProcessing: false
    }
    const {authenticated, error} = action.payload || {}
    if (error) {
      update.error = error
    } else if (authenticated) {
      update.authenticated = authenticated
    } else {
      update.isProcessing = true
    }
    return Object.assign({}, state, update)
  }
}, {
  keycloak: new window.Keycloak('/keycloak.json'),
  isProcessing: false,
  authenticated: false
})
