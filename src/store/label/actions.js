import {
  createRequestAction,
  createSuccessAction,
  createFailureAction,
  dispatchAction
} from 'store/helper'

import LabelApi from 'api/label'

// --------------------------------------
// Constants
// --------------------------------------
export const FETCH_LABEL = 'FETCH_LABEL'
export const CREATE_LABEL = 'CREATE_LABEL'
export const UPDATE_LABEL = 'UPDATE_LABEL'
export const REMOVE_LABEL = 'REMOVE_LABEL'
export const RESTORE_LABEL = 'RESTORE_LABEL'
export const DISCARD_LABEL = 'DISCARD_LABEL'

// --------------------------------------
// Fetch label actions
// --------------------------------------
const fetchLabelRequest = createRequestAction(FETCH_LABEL)
const fetchLabelFailure = createFailureAction(FETCH_LABEL)
const fetchLabelSuccess = createSuccessAction(FETCH_LABEL)

export const fetchLabel = (id) => {
  return (dispatch, getState) => {
    const {label: l} = getState()
    if (l.isProcessing) {
      console.warn('Unable to fetch label. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching label:', id)
    dispatch(fetchLabelRequest())
    return LabelApi.get(id)
      .then(
        res => dispatchAction(dispatch, fetchLabelSuccess(res)),
        err => dispatchAction(dispatch, fetchLabelFailure(err))
      )
  }
}

// --------------------------------------
// Create label actions
// --------------------------------------
const createLabelRequest = createRequestAction(CREATE_LABEL)
const createLabelFailure = createFailureAction(CREATE_LABEL)
const createLabelSuccess = createSuccessAction(CREATE_LABEL)

export const createLabel = (label) => {
  return (dispatch, getState) => {
    console.debug('Creating label:', label)
    dispatch(createLabelRequest())
    return LabelApi.create(label)
      .then(
        res => dispatchAction(dispatch, createLabelSuccess(res)),
        err => dispatchAction(dispatch, createLabelFailure(err))
      )
  }
}

// --------------------------------------
// Update label actions
// --------------------------------------
const updateLabelRequest = createRequestAction(UPDATE_LABEL)
const updateLabelFailure = createFailureAction(UPDATE_LABEL)
const updateLabelSuccess = createSuccessAction(UPDATE_LABEL)

export const updateLabel = (label, payload) => {
  return (dispatch, getState) => {
    const {label: l} = getState()
    if (l.isProcessing) {
      console.warn('Unable to update label. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Updating label:', label)
    dispatch(updateLabelRequest())
    return LabelApi.update(label, payload)
      .then(
        res => dispatchAction(dispatch, updateLabelSuccess(res)),
        err => dispatchAction(dispatch, updateLabelFailure(err))
      )
  }
}

// --------------------------------------
// Remove label actions
// --------------------------------------
const removeLabelRequest = createRequestAction(REMOVE_LABEL)
const removeLabelFailure = createFailureAction(REMOVE_LABEL)
const removeLabelSuccess = createSuccessAction(REMOVE_LABEL)

export const removeLabel = (label) => {
  return (dispatch, getState) => {
    console.debug('Removing label:', label.id)
    dispatch(removeLabelRequest())
    return LabelApi.remove(label)
      .then(
        res => dispatchAction(dispatch, removeLabelSuccess(null)),
        err => dispatchAction(dispatch, removeLabelFailure(err))
      )
  }
}

// --------------------------------------
// Restore label actions
// --------------------------------------
const restoreLabelRequest = createRequestAction(RESTORE_LABEL)
const restoreLabelFailure = createFailureAction(RESTORE_LABEL)
const restoreLabelSuccess = createSuccessAction(RESTORE_LABEL)

export const restoreRemovedLabel = () => {
  return (dispatch, getState) => {
    const {labels} = getState()
    if (!labels.removed) {
      return Promise.reject({error: 'No label to restore.'})
    }
    console.debug('Restoring label:', labels.removed.id)
    dispatch(restoreLabelRequest())
    return LabelApi.restore(labels.removed)
      .then(
        res => dispatchAction(dispatch, restoreLabelSuccess(res)),
        err => dispatchAction(dispatch, restoreLabelFailure(err))
      )
  }
}

// --------------------------------------
// Discard label actions
// --------------------------------------
const discardLabel = createRequestAction(DISCARD_LABEL)

const actions = {
  fetchLabel,
  createLabel,
  updateLabel,
  removeLabel,
  restoreRemovedLabel,
  discardLabel
}

export default actions

