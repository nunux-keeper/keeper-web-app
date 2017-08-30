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
export const UPDATE_PROFILE = 'UPDATE_PROFILE'

// ------------------------------------
// Fetch profile actions
// ------------------------------------
const fetchProfileRequest = createRequestAction(FETCH_PROFILE)
const fetchProfileFailure = createFailureAction(FETCH_PROFILE)
const fetchProfileSuccess = createSuccessAction(FETCH_PROFILE)

export const fetchProfile = () => {
  return (dispatch, getState) => {
    const {profile} = getState()
    if (profile.isProcessing) {
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

// ------------------------------------
// Update profile actions
// ------------------------------------
const updateProfileRequest = createRequestAction(UPDATE_PROFILE)
const updateProfileFailure = createFailureAction(UPDATE_PROFILE)
const updateProfileSuccess = createSuccessAction(UPDATE_PROFILE)

export const updateProfile = (update) => {
  return (dispatch, getState) => {
    const {profile} = getState()
    if (profile.isProcessing) {
      console.warn('Unable to update profile. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Updating profile...')
    dispatch(updateProfileRequest())
    return ProfileApi.update(update)
      .then(
        res => dispatchAction(dispatch, updateProfileSuccess(res)),
        err => dispatchAction(dispatch, updateProfileFailure(err))
      )
  }
}

const actions = {
  fetchProfile,
  updateProfile
}

export default actions

