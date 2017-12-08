import { handleActions } from 'redux-actions'

import { commonActionHandler } from 'store/helper'

import {
  FETCH_CLIENT,
  CREATE_CLIENT,
  UPDATE_CLIENT,
  REMOVE_CLIENT,
  RESET_CLIENT
} from './actions'

const defaultState = {
  isProcessing: false,
  current: {
    id: null,
    name: '',
    clientId: '',
    clientSecret: '',
    redirectUris: [],
    webOrigins: [],
    cdate: null,
    mdate: null
  },
  error: null
}

// --------------------------------------
// Reducer
// --------------------------------------
export default handleActions({
  [FETCH_CLIENT]: commonActionHandler,
  [CREATE_CLIENT]: commonActionHandler,
  [UPDATE_CLIENT]: commonActionHandler,
  [REMOVE_CLIENT]: commonActionHandler,
  [RESET_CLIENT]: (state, action) => {
    if (state.isProcessing) {
      console.warn('Unable to reset client state. An action is pending...')
      return state
    }
    return Object.assign({}, defaultState)
  }
}, defaultState)

