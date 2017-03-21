import { handleActions } from 'redux-actions'

import { FETCH_PROFILE } from './actions'

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_PROFILE]: (state, action) => {
    const update = {
      isProcessing: false,
      error: null
    }
    const {request, success, failure} = action.meta
    if (failure) {
      update.error = action.payload
    } else if (success) {
      update.current = action.payload
    } else if (request) {
      update.isProcessing = true
    }
    return Object.assign({}, state, update)
  }
}, {
  isProcessing: false,
  current: null,
  error: null
})
