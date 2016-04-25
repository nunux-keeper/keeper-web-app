import { createAction, handleActions } from 'redux-actions'
import AppsApi from 'api/apps'

const errorHandler = function (err) {
  return {error: err}
}

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_APPS = 'FETCH_APPS'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchAppsRequest = createAction(FETCH_APPS)
export const fetchAppsFailure = createAction(FETCH_APPS, errorHandler)
export const fetchAppsSuccess = createAction(FETCH_APPS, (apps) => {
  console.debug('Granted apps fetched:', apps.length)
  return {response: apps}
})

export const fetchApps = () => {
  return (dispatch, getState) => {
    const {user, apps} = getState()
    if (apps.isFetching) {
      console.warn('Unable to fetch apps. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching apps...')
    dispatch(fetchAppsRequest())
    return AppsApi.getInstance(user).get()
    .then((apps) => dispatch(fetchAppsSuccess(apps)))
    .catch((err) => dispatch(fetchAppsFailure(err)))
  }
}

export const actions = {
  fetchApps
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_APPS]: (state, action) => {
    const update = {
      isFetching: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.items = response
    }
    return Object.assign({}, state, update)
  }
}, {
  isFetching: false,
  items: [],
  error: null
})
