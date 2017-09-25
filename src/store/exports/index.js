import { handleActions } from 'redux-actions'

import { SCHEDULE_EXPORT, EXPORT_STATUS } from './actions'

const scheduleActionHandler = function (state, action) {
  const update = {
    isProcessing: false,
    error: null,
    progress: -1
  }
  const {request, failure} = action.meta
  if (failure) {
    update.error = action.payload
  } else if (request) {
    update.isProcessing = true
  }
  return Object.assign({}, state, update)
}

const statusActionHandler = function (state, action) {
  const update = {
    isProcessing: false,
    error: null
  }
  const {request, progress, success, failure} = action.meta
  if (failure) {
    update.error = action.payload
  } else if (success) {
    update.progress = 100
    update.exported = action.payload
    update.total = action.payload
  } else if (request) {
    update.isProcessing = true
    // update.progress = 0
    // update.exported = 0
  } else if (progress) {
    const p = action.payload.split('|')
    update.progress = parseInt(p[0], 10)
    if (update.progress % 5 !== 0) {
      // Drop too tiny progress
      return state
    }
    update.exported = p[1]
    update.total = p[2]
    update.isProcessing = true
  }
  return Object.assign({}, state, update)
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SCHEDULE_EXPORT]: scheduleActionHandler,
  [EXPORT_STATUS]: statusActionHandler
}, {
  isProcessing: false,
  progress: -1,
  exported: 0,
  total: 0,
  error: null
})
