import { handleActions } from 'redux-actions'

import { commonActionHandler } from 'store/helper'

import {
  FETCH_PROFILE,
  UPDATE_PROFILE
} from './actions'

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_PROFILE]: commonActionHandler,
  [UPDATE_PROFILE]: commonActionHandler
}, {
  isProcessing: false,
  current: null,
  error: null
})
