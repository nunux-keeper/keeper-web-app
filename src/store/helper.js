import { bindActionCreators } from 'redux'
import { createAction } from 'redux-actions'

// Create wrappers for typed action:
// - request action
// - success action
// - failure action
// - progress action
export const createRequestAction = name => createAction(name, null, () => ({request: true}))
export const createSuccessAction = name => createAction(name, null, () => ({success: true}))
export const createFailureAction = name => createAction(name, null, () => ({failure: true}))
export const createProgressAction = name => createAction(name, null, () => ({progress: true}))

/**
 * Dispatch an action and return a rpromise related to the action payload type.
 * @param {Function} dispatch The dispatcher
 * @param {Object} action The action to dispatch
 * @return {Promise} promise of the action
 */
export const dispatchAction = function (dispatch, action) {
  // The action is dispatched...
  dispatch(action)
  // If action is a failure
  // then the promise is rejected with this error
  if (action.meta.failure) {
    console.error(action.payload)
    return Promise.reject(action.payload)
  }
  // Otherwise the promise is resovled
  return Promise.resolve(action.payload)
}

/**
 * @deprecated
 */
export const errorHandler = function (err) {
  return {error: err}
}

/**
 * @deprecated
 */
export const payloadResponse = function (res) {
  if (res.payload.error) {
    return Promise.reject(res.payload.error)
  } else {
    const payload = res.payload.response || res.payload
    return Promise.resolve(payload)
  }
}

/**
 * Bind actions to the 'actions' property of an object.
 * @param {Array} actions Actions to bind
 * @param {Function} dispatch The dispatcher
 * @return {Object} Actions object
 */
export const bindActions = function (actions, dispatch) {
  const result = Object.keys(actions).reduce((acc, key) => {
    acc[key] = bindActionCreators(actions[key], dispatch)
    return acc
  }, {})
  return {actions: result}
}

/**
 * Common action handler for CRUD operations.
 * Manage a classic CRUD state of a object.
 * @param {Object} state The global state
 * @param {Object} action The applied action
 * @return the altered store
 */
export const commonActionHandler = function (state, action) {
  const update = {
    isProcessing: false,
    error: null
  }
  const {request, success, failure} = action.meta
  if (failure) {
    update.error = action.payload
  } else if (success) {
    update.current = action.payload
  } else if (request) {
    update.isProcessing = true
  }
  return Object.assign({}, state, update)
}

