import { createAction, handleActions } from 'redux-actions'
import { pushPath } from 'redux-simple-router'
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
export const REQUEST_TOKEN = 'REQUEST_TOKEN'
export const RECEIVE_TOKEN = 'RECEIVE_TOKEN'

// ------------------------------------
// Actions
// ------------------------------------
export const requestToken = createAction(REQUEST_TOKEN)
export const receiveToken = createAction(RECEIVE_TOKEN, (token) => {
  return {
    token: token,
    receivedAt: Date.now()
  }
})

export const loginWith = (provider, redirect) => {
  return (dispatch, getState) => {
    // Get token from state
    const {token} = getState()
    if (token) {
      return dispatch(receiveToken(token))
    }
    // Get token from login process
    dispatch(requestToken())
    return AuthApi.getInstance().login(provider)
    .then(token => {
      dispatch(receiveToken(token))
      dispatch(pushPath(redirect))
    })
  }
}

export const actions = {
  loginWith
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_TOKEN]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [RECEIVE_TOKEN]: (state, action) => {
    localStorage.token = action.payload.token
    return Object.assign({}, state, {
      isFetching: false,
      token: action.payload.token,
      user: decodeToken(action.payload.token),
      receivedAt: action.payload.receivedAt
    })
  }
}, {
  isFetching: false,
  token: localStorage.token,
  user: decodeToken(localStorage.token)
})
