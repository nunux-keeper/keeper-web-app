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
export const FETCH_CLIENTS = 'FETCH_CLIENTS'

// --------------------------------------
// Fetch clients actions
// --------------------------------------
const fetchClientsRequest = createRequestAction(FETCH_CLIENTS)
const fetchClientsFailure = createFailureAction(FETCH_CLIENTS)
const fetchClientsSuccess = createSuccessAction(FETCH_CLIENTS)

export const fetchClients = () => {
  return (dispatch, getState) => {
    const { clients } = getState()
    if (clients.isProcessing) {
      console.warn('Unable to fetch clients. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching clients...')
    dispatch(fetchClientsRequest())
    return ClientApi.all()
      .then(
        res => dispatchAction(dispatch, fetchClientsSuccess(res)),
        err => dispatchAction(dispatch, fetchClientsFailure(err))
      )
  }
}

const actions = {
  fetchClients
}

export default actions

