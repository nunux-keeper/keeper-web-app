import { createAction, handleActions } from 'redux-actions'
import { push } from 'react-router-redux'
import AuthApi from 'api/auth'
import jwtDecode from 'jwt-decode'

function decodeToken (token) {
  if (token) {
    const t = jwtDecode(token)
    return {
      uid: t.sub
    }
  } else {
    return null
  }
}

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_TOKEN = 'FETCH_TOKEN'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchTokenRequest = createAction(FETCH_TOKEN)
export const fetchTokenFailure = createAction(FETCH_TOKEN, (err) => {
  return { error: err }
})
export const fetchTokenSuccess = createAction(FETCH_TOKEN, (token) => {
  return { token }
})

export const loginWith = (provider, redirect) => {
  return (dispatch, getState) => {
    // Get token from state
    const {token} = getState()
    if (token) {
      return dispatch(fetchTokenSuccess(token))
    }
    // Get token from login process
    dispatch(fetchTokenRequest())
    return AuthApi.getInstance().login(provider)
    .then((token) => {
      dispatch(fetchTokenSuccess(token))
      dispatch(push(redirect))
    })
    .catch((err) => dispatch(fetchTokenFailure(err)))
  }
}

export const actions = {
  loginWith
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_TOKEN]: (state, action) => {
    const update = {
      isFetching: false
    }
    const {token, error} = action.payload || {}
    if (error) {
      update.error = error
    } else if (token) {
      update.token = token
      update.user = decodeToken(token)
    } else {
      update.isFetching = true
    }
    return Object.assign({}, state, update)
  }
}, {
  isFetching: false,
  token: localStorage.token,
  user: decodeToken(localStorage.token)
})
