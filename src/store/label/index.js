import { handleActions } from 'redux-actions'

import { commonActionHandler } from 'store/helper'

import {
  FETCH_LABEL,
  CREATE_LABEL,
  UPDATE_LABEL,
  REMOVE_LABEL,
  RESTORE_LABEL,
  DISCARD_LABEL
} from './actions'

// --------------------------------------
// Reducer
// --------------------------------------
export default handleActions({
  [FETCH_LABEL]: commonActionHandler,
  [CREATE_LABEL]: commonActionHandler,
  [UPDATE_LABEL]: commonActionHandler,
  [REMOVE_LABEL]: commonActionHandler,
  [RESTORE_LABEL]: commonActionHandler,
  [DISCARD_LABEL]: (state, action) => {
    return Object.assign({}, state, {
      isProcessing: false,
      current: null
    })
  }
}, {
  isProcessing: false,
  current: null,
  error: null
})

