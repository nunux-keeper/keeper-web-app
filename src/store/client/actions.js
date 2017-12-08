import {
  createRequestAction,
  createSuccessAction,
  createFailureAction,
  dispatchAction
} from 'store/helper'

import ClientApi from 'api/client'

// --------------------------------------
// Constants
// --------------------------------------
export const FETCH_CLIENT = 'FETCH_CLIENT'
export const CREATE_CLIENT = 'CREATE_CLIENT'
export const UPDATE_CLIENT = 'UPDATE_CLIENT'
export const REMOVE_CLIENT = 'REMOVE_CLIENT'
export const RESET_CLIENT = 'RESET_CLIENT'

// --------------------------------------
// Fetch client actions
// --------------------------------------
const fetchClientRequest = createRequestAction(FETCH_CLIENT)
const fetchClientFailure = createFailureAction(FETCH_CLIENT)
const fetchClientSuccess = createSuccessAction(FETCH_CLIENT)

export const fetchClient = (id) => {
  return (dispatch, getState) => {
    const { client } = getState()
    if (client.isProcessing) {
      console.warn('Unable to fetch client. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching client:', id)
    dispatch(fetchClientRequest())
    return ClientApi.get(id)
      .then(
        res => dispatchAction(dispatch, fetchClientSuccess(res)),
        err => dispatchAction(dispatch, fetchClientFailure(err))
      )
  }
}

// --------------------------------------
// Create client actions
// --------------------------------------
const createClientRequest = createRequestAction(CREATE_CLIENT)
const createClientFailure = createFailureAction(CREATE_CLIENT)
const createClientSuccess = createSuccessAction(CREATE_CLIENT)

export const createClient = (client) => {
  return (dispatch, getState) => {
    console.debug('Creating client:', client)
    dispatch(createClientRequest())
    return ClientApi.create(client)
      .then(
        res => dispatchAction(dispatch, createClientSuccess(res)),
        err => dispatchAction(dispatch, createClientFailure(err))
      )
  }
}

// --------------------------------------
// Update client actions
// --------------------------------------
const updateClientRequest = createRequestAction(UPDATE_CLIENT)
const updateClientFailure = createFailureAction(UPDATE_CLIENT)
const updateClientSuccess = createSuccessAction(UPDATE_CLIENT)

export const updateClient = (update) => {
  return (dispatch, getState) => {
    const { client } = getState()
    if (client.isProcessing) {
      console.warn('Unable to update client. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Updating client:', client.current)
    dispatch(updateClientRequest())
    return ClientApi.update(client.current, update)
      .then(
        res => dispatchAction(dispatch, updateClientSuccess(res)),
        err => dispatchAction(dispatch, updateClientFailure(err))
      )
  }
}

// --------------------------------------
// Remove client actions
// --------------------------------------
const removeClientRequest = createRequestAction(REMOVE_CLIENT)
const removeClientFailure = createFailureAction(REMOVE_CLIENT)
const removeClientSuccess = createSuccessAction(REMOVE_CLIENT)

export const removeClient = (client) => {
  return (dispatch, getState) => {
    console.debug('Removing client:', client.id)
    dispatch(removeClientRequest())
    return ClientApi.remove(client)
      .then(
        res => dispatchAction(dispatch, removeClientSuccess(client)),
        err => dispatchAction(dispatch, removeClientFailure(err))
      )
  }
}

// --------------------------------------
// Reset client action
// --------------------------------------
const resetClient = createRequestAction(RESET_CLIENT)

const actions = {
  fetchClient,
  createClient,
  updateClient,
  removeClient,
  resetClient
}

export default actions

