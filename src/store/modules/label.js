import { createAction, handleActions } from 'redux-actions'
import LabelApi from 'api/label'
import { errorHandler, payloadResponse } from 'store/helper'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_LABEL = 'FETCH_LABEL'
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
    const {label: l} = getState()
    if (l.isFetching || l.isProcessing) {
      console.warn('Unable to fetch label. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching label:', id)
    dispatch(fetchLabelRequest())
    return LabelApi.get(id)
    .then((label) => dispatch(fetchLabelSuccess(label)))
    .catch((err) => dispatch(fetchLabelFailure(err)))
    .then(payloadResponse)
  }
}

export const createLabel = (label) => {
  return (dispatch, getState) => {
    console.debug('Creating label:', label)
    dispatch(createLabelRequest())
    return LabelApi.create(label)
    .then((_label) => dispatch(createLabelSuccess(_label)))
    .catch((err) => dispatch(createLabelFailure(err)))
    .then(payloadResponse)
  }
}

export const updateLabel = (label, payload) => {
  return (dispatch, getState) => {
    const {label: l} = getState()
    if (l.isFetching || l.isProcessing) {
      console.warn('Unable to update label. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Updating label:', label)
    dispatch(updateLabelRequest())
    return LabelApi.update(label, payload)
    .then((_label) => dispatch(updateLabelSuccess(_label)))
    .catch((err) => dispatch(updateLabelFailure(err)))
    .then(payloadResponse)
  }
}

export const removeLabel = (label) => {
  return (dispatch, getState) => {
    console.debug('Removing label:', label.id)
    dispatch(removeLabelRequest())
    return LabelApi.remove(label)
    .then(() => dispatch(removeLabelSuccess(label)))
    .catch((err) => dispatch(removeLabelFailure(err)))
    .then(payloadResponse)
  }
}

export const restoreRemovedLabel = () => {
  return (dispatch, getState) => {
    const {labels} = getState()
    if (!labels.removed) {
      return Promise.reject({error: 'No label to restore.'})
    }
    console.debug('Restoring label:', labels.removed.id)
    dispatch(restoreLabelRequest())
    return LabelApi.restore(labels.removed)
    .then((_label) => dispatch(restoreLabelSuccess(_label)))
    .catch((err) => dispatch(restoreLabelFailure(err)))
    .then(payloadResponse)
  }
}

export const discardLabel = createAction(DISCARD_LABEL)

export const actions = {
  fetchLabel,
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
  current: null,
  error: null
})
