import { createAction, handleActions } from 'redux-actions'
import LabelApi from 'api/label'

import _ from 'lodash'

const errorHandler = function (err) {
  return {error: err}
}

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_LABEL = 'FETCH_LABEL'
export const FETCH_LABELS = 'FETCH_LABELS'
export const CREATE_LABEL = 'CREATE_LABEL'
export const UPDATE_LABEL = 'UPDATE_LABEL'
export const REMOVE_LABEL = 'REMOVE_LABEL'
export const RESTORE_LABEL = 'RESTORE_LABEL'
export const DISCARD_LABEL = 'DISCARD_LABEL'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchLabelRequest = createAction(FETCH_LABEL)
export const fetchLabelFailure = createAction(FETCH_LABEL, errorHandler)
export const fetchLabelSuccess = createAction(FETCH_LABEL, (label) => {
  console.debug('Label fetched:', label.id)
  return {response: label}
})

export const fetchLabelsRequest = createAction(FETCH_LABELS)
export const fetchLabelsFailure = createAction(FETCH_LABELS, errorHandler)
export const fetchLabelsSuccess = createAction(FETCH_LABELS, (res) => {
  console.debug('Labels fetched:', res.labels)
  return {response: res.labels}
})

export const createLabelRequest = createAction(CREATE_LABEL)
export const createLabelFailure = createAction(CREATE_LABEL, errorHandler)
export const createLabelSuccess = createAction(CREATE_LABEL, (label) => {
  console.debug('Label created:', label.id)
  return {response: label}
})

export const updateLabelRequest = createAction(UPDATE_LABEL)
export const updateLabelFailure = createAction(UPDATE_LABEL, errorHandler)
export const updateLabelSuccess = createAction(UPDATE_LABEL, (label) => {
  console.debug('Label updated:', label.id)
  return {response: label}
})

export const removeLabelRequest = createAction(REMOVE_LABEL)
export const removeLabelFailure = createAction(REMOVE_LABEL, errorHandler)
export const removeLabelSuccess = createAction(REMOVE_LABEL, (label) => {
  console.debug('Label removed:', label.id)
  return {response: label}
})

export const restoreLabelRequest = createAction(RESTORE_LABEL)
export const restoreLabelFailure = createAction(RESTORE_LABEL, errorHandler)
export const restoreLabelSuccess = createAction(RESTORE_LABEL, (label) => {
  console.debug('Label restored:', label.id)
  return {response: label}
})

export const fetchLabel = (id) => {
  return (dispatch, getState) => {
    const {labels: l} = getState()
    if (l.isFetching || l.isProcessing) {
      console.warn('Unable to fetch label. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching label:', id)
    dispatch(fetchLabelRequest())
    return LabelApi.get(id)
    .then((label) => dispatch(fetchLabelSuccess(label)))
    .catch((err) => dispatch(fetchLabelFailure(err)))
  }
}

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
    }
  }
}

export const createLabel = (label) => {
  return (dispatch, getState) => {
    console.debug('Creating label:', label)
    dispatch(createLabelRequest())
    return LabelApi.create(label)
    .then((_label) => dispatch(createLabelSuccess(_label)))
    .catch((err) => dispatch(createLabelFailure(err)))
  }
}

export const updateLabel = (label, payload) => {
  return (dispatch, getState) => {
    const {labels: l} = getState()
    if (l.isFetching || l.isProcessing) {
      console.warn('Unable to update label. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Updating label:', label)
    dispatch(updateLabelRequest())
    return LabelApi.update(label, payload)
    .then((_label) => dispatch(updateLabelSuccess(_label)))
    .catch((err) => dispatch(updateLabelFailure(err)))
  }
}

export const removeLabel = (label) => {
  return (dispatch, getState) => {
    console.debug('Removing label:', label.id)
    dispatch(removeLabelRequest())
    return LabelApi.remove(label)
    .then(() => dispatch(removeLabelSuccess(label)))
    .catch((err) => dispatch(removeLabelFailure(err)))
  }
}

export const restoreRemovedLabel = () => {
  return (dispatch, getState) => {
    const {labels} = getState()
    if (!labels.removed) {
      return Promise.reject('No label to restore.')
    }
    console.debug('Restoring label:', labels.removed.id)
    dispatch(restoreLabelRequest())
    return LabelApi.restore(labels.removed)
    .then((_label) => dispatch(restoreLabelSuccess(_label)))
    .catch((err) => dispatch(restoreLabelFailure(err)))
  }
}

export const discardLabel = createAction(DISCARD_LABEL)

export const actions = {
  fetchLabel,
  fetchLabels,
  createLabel,
  updateLabel,
  removeLabel,
  restoreRemovedLabel,
  discardLabel
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_LABEL]: (state, action) => {
    const update = {
      isProcessing: action.payload == null,
      isFetching: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
    }
    return Object.assign({}, state, update)
  },
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
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
    }
    return Object.assign({}, state, update)
  },
  [UPDATE_LABEL]: (state, action) => {
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
      const exists = state.items.find((item) => item.id === update.current.id)
      if (exists) {
        // Update item into the list
        update.items = state.items.map((item) => {
          if (item.id === update.current.id) {
            item = update.current
          }
          return item
        })
      }
    }
    return Object.assign({}, state, update)
  },
  [REMOVE_LABEL]: (state, action) => {
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = null
      const label = response
      const index = _.findIndex(state.items, (item) => item.id === label.id)
      if (index >= 0) {
        update.items = state.items.filter((item) => item.id !== label.id)
        update.removed = label
        update.removedIndex = index
      }
    }
    return Object.assign({}, state, update)
  },
  [RESTORE_LABEL]: (state, action) => {
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
      update.items = state.items.slice()
      update.items.splice(state.removedIndex, 0, update.current)
      update.removed = null
      update.removedIndex = null
    }
    return Object.assign({}, state, update)
  },
  [DISCARD_LABEL]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      isProcessing: false,
      current: null
    })
  }
}, {
  isFetching: false,
  isProcessing: false,
  removed: null,
  removedIndex: null,
  items: [],
  current: null,
  error: null
})
