import {
  createRequestAction,
  createSuccessAction,
  createFailureAction,
  dispatchAction
} from 'store/helper'

import ProfileApi from 'api/profile'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_PROFILE = 'FETCH_PROFILE'

// ------------------------------------
// Actions
// ------------------------------------
const fetchProfileRequest = createRequestAction(FETCH_PROFILE)
const fetchProfileFailure = createFailureAction(FETCH_PROFILE)
const fetchProfileSuccess = createSuccessAction(FETCH_PROFILE)

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
      .then(
        res => dispatchAction(dispatch, fetchProfileSuccess(res)),
        err => dispatchAction(dispatch, fetchProfileFailure(err))
      )
  }
}

const actions = {
  fetchProfile
}

export default actions

