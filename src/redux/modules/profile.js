import { createAction, handleActions } from 'redux-actions'
import ProfileApi from 'api/profile'

const errorHandler = function (err) {
  return {error: err}
}

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_PROFILE = 'FETCH_PROFILE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchProfileRequest = createAction(FETCH_PROFILE)
export const fetchProfileFailure = createAction(FETCH_PROFILE, errorHandler)
export const fetchProfileSuccess = createAction(FETCH_PROFILE, (profile) => {
  console.debug('Profile fetched:', profile)
  return {response: profile}
})

export const fetchProfile = () => {
  return (dispatch, getState) => {
    const {profile} = getState()
    if (profile.isFetching) {
      console.warn('Unable to fetch profile. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching profile...')
    dispatch(fetchProfileRequest())
    return ProfileApi.get()
    .then((profile) => dispatch(fetchProfileSuccess(profile)))
    .catch((err) => dispatch(fetchProfileFailure(err)))
  }
}

export const actions = {
  fetchProfile
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_PROFILE]: (state, action) => {
    const update = {
      isFetching: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
    }
    return Object.assign({}, state, update)
  }
}, {
  isFetching: false,
  current: null,
  error: null
})
