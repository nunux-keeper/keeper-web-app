import { createAction, handleActions } from 'redux-actions'
import LabelApi from 'api/label'
import { errorHandler, payloadResponse } from 'store/helper'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_LABELS = 'FETCH_LABELS'
export const CREATE_LABEL = 'CREATE_LABEL'
export const UPDATE_LABEL = 'UPDATE_LABEL'
export const REMOVE_LABEL = 'REMOVE_LABEL'
export const RESTORE_LABEL = 'RESTORE_LABEL'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchLabelsRequest = createAction(FETCH_LABELS)
export const fetchLabelsFailure = createAction(FETCH_LABELS, errorHandler)
export const fetchLabelsSuccess = createAction(FETCH_LABELS, (res) => {
  console.debug('Labels fetched:', res.labels)
  return {response: res.labels}
})

export const fetchLabels = () => {
  return (dispatch, getState) => {
    const {labels} = getState()
    if (labels.isFetching || labels.isProcessing) {
      console.warn('Unable to fetch labels. An action is pending...')
      return Promise.resolve(null)
    } else {
      console.debug('Fetching labels')
      dispatch(fetchLabelsRequest())
      return LabelApi.all()
      .then((labels) => dispatch(fetchLabelsSuccess(labels)))
      .catch((err) => dispatch(fetchLabelsFailure(err)))
      .then(payloadResponse)
    }
  }
}

export const actions = {
  fetchLabels
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_LABELS]: (state, action) => {
    const update = {
      isProcessing: action.payload == null,
      isFetching: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.items = response
    }
    return Object.assign({}, state, update)
  },
  [CREATE_LABEL]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Add created label to the list
      const update = {
        items: [response, ...state.items]
      }
      return Object.assign({}, state, update)
    }
    return state
  },
  [UPDATE_LABEL]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Update label into the list (if present)
      const label = response
      const update = {}
      let updated = false
      update.items = state.items.reduce((acc, item, index) => {
        if (item.id === label.id) {
          item = label
          updated = true
        }
        acc.push(item)
        return acc
      }, [])
      if (updated) {
        return Object.assign({}, state, update)
      }
    }
    return state
  },
  [REMOVE_LABEL]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Remove label from the list (if present)
      const label = response
      const update = {}
      update.items = state.items.reduce((acc, item, index) => {
        if (item.id === label.id) {
          update.removedIndex = index
          update.removed = item
        } else {
          acc.push(item)
        }
        return acc
      }, [])
      if (update.removed) {
        return Object.assign({}, state, update)
      }
    }
    return state
  },
  [RESTORE_LABEL]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Restore label into the list
      const idx = state.removedIndex || 0
      const update = {}
      update.items = state.items.slice()
      update.items.splice(idx, 0, response)
      update.removed = null
      update.removedIndex = null
      return Object.assign({}, state, update)
    }
    return state
  }
}, {
  isFetching: false,
  isProcessing: false,
  removed: null,
  removedIndex: null,
  items: [],
  error: null
})
