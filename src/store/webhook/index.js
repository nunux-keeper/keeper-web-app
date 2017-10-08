import { handleActions } from 'redux-actions'

import { commonActionHandler } from 'store/helper'

import {
  FETCH_WEBHOOK,
  CREATE_WEBHOOK,
  UPDATE_WEBHOOK,
  REMOVE_WEBHOOK,
  RESET_WEBHOOK
} from './actions'

const defaultState = {
  isProcessing: false,
  current: {
    id: null,
    url: '',
    secret: '',
    events: [],
    labels: []
  },
  error: null
}

// --------------------------------------
// Reducer
// --------------------------------------
export default handleActions({
  [FETCH_WEBHOOK]: commonActionHandler,
  [CREATE_WEBHOOK]: commonActionHandler,
  [UPDATE_WEBHOOK]: commonActionHandler,
  [REMOVE_WEBHOOK]: commonActionHandler,
  [RESET_WEBHOOK]: (state, action) => {
    if (state.isProcessing) {
      console.warn('Unable to reset webhook state. An action is pending...')
      return state
    }
    return Object.assign({}, defaultState)
  }
}, defaultState)

