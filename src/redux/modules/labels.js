import { createAction, handleActions } from 'redux-actions'
import LabelApi from 'api/label'

import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_LABELS = 'REQUEST_LABELS'
export const RECEIVE_LABELS = 'RECEIVE_LABELS'
export const REMOVING_FROM_LABELS = 'REMOVING_FROM_LABELS'
export const REMOVED_FROM_LABELS = 'REMOVED_FROM_LABELS'
export const RESTORING_FROM_LABELS = 'RESTORING_FROM_LABELS'
export const RESTORED_FROM_LABELS = 'RESTORED_FROM_LABELS'
export const DISCARD_RESTORED_LABEL = 'DISCARD_RESTORED_LABEL'
export const DISCARD_REMOVED_LABEL = 'DISCARD_REMOVED_LABEL'

// ------------------------------------
// Actions
// ------------------------------------
export const requestLabels = createAction(REQUEST_LABELS)
export const receiveLabels = createAction(RECEIVE_LABELS, (labels) => {
  return {
    labels: labels,
    receivedAt: Date.now()
  }
})

export const fetchLabels = () => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(requestLabels())
    return LabelApi.getInstance(user).all()
    .then((labels) => dispatch(receiveLabels(labels)))
  }
}

export const removingFromLabels = createAction(REMOVING_FROM_LABELS)
export const removedFromLabels = createAction(REMOVED_FROM_LABELS, (label) => {
  console.debug('Label deleted:', label.id)
  return {
    label: label,
    removedAt: Date.now()
  }
})

export const removeFromLabels = (label) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(removingFromLabels())
    return LabelApi.getInstance(user).remove(label)
    .then(() => dispatch(removedFromLabels(label)))
  }
}

export const restoringFromLabels = createAction(RESTORING_FROM_LABELS)
export const restoredFromLabels = createAction(RESTORED_FROM_LABELS, (label) => {
  console.debug('Label restored:', label.id)
  return {
    label: label,
    restoredAt: Date.now()
  }
})

export const restoreFromLabels = (label) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(restoringFromLabels())
    return LabelApi.getInstance(user).restore(label)
    .then((_label) => dispatch(restoredFromLabels(_label)))
  }
}

export const discardRemovedLabel = createAction(DISCARD_REMOVED_LABEL)
export const discardRestoredLabel = createAction(DISCARD_RESTORED_LABEL)

export const actions = {
  fetchLabels,
  removeFromLabels,
  restoreFromLabels,
  discardRemovedLabel,
  discardRestoredLabel
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_LABELS]: (state) => {
    return Object.assign({}, state, {isFetching: true})
  },
  [RECEIVE_LABELS]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: action.payload.labels,
      lastUpdated: action.payload.receivedAt
    })
  },
  [REMOVING_FROM_LABELS]: (state) => {
    return Object.assign({}, state, {isProcessing: true})
  },
  [REMOVED_FROM_LABELS]: (state, action) => {
    const index = _.findIndex(state.items, (item) => item.id === action.payload.label.id)
    return Object.assign({}, state, {
      isProcessing: false,
      items: state.items.filter((item) => item.id !== action.payload.label.id),
      removed: action.payload.label,
      removedIndex: index,
      lastUpdated: action.payload.removedAt
    })
  },
  [RESTORING_FROM_LABELS]: (state) => {
    return Object.assign({}, state, {isProcessing: true})
  },
  [RESTORED_FROM_LABELS]: (state, action) => {
    const restoredItems = state.items.slice()
    restoredItems.splice(state.removedIndex, 0, action.payload.label)
    return Object.assign({}, state, {
      isProcessing: false,
      items: restoredItems,
      removed: null,
      removedIndex: null,
      restored: action.payload.label,
      lastUpdated: action.payload.restoredAt
    })
  },
  [DISCARD_RESTORED_LABEL]: (state) => {
    return Object.assign({}, state, {restored: null})
  },
  [DISCARD_REMOVED_LABEL]: (state) => {
    return Object.assign({}, state, {removed: null, removedIndex: null})
  }
}, {
  isFetching: false,
  isProcessing: false,
  removed: null,
  removedIndex: null,
  restored: null,
  items: []
})
