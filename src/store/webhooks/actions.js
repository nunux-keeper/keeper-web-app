import {
  createRequestAction,
  createSuccessAction,
  createFailureAction,
  dispatchAction
} from 'store/helper'

import WebhookApi from 'api/webhook'

// --------------------------------------
// Constants
// --------------------------------------
export const FETCH_WEBHOOKS = 'FETCH_WEBHOOKS'

// --------------------------------------
// Fetch webhooks actions
// --------------------------------------
const fetchWebhooksRequest = createRequestAction(FETCH_WEBHOOKS)
const fetchWebhooksFailure = createFailureAction(FETCH_WEBHOOKS)
const fetchWebhooksSuccess = createSuccessAction(FETCH_WEBHOOKS)

export const fetchWebhooks = () => {
  return (dispatch, getState) => {
    const { webhooks } = getState()
    if (webhooks.isProcessing) {
      console.warn('Unable to fetch webhooks. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching webhooks...')
    dispatch(fetchWebhooksRequest())
    return WebhookApi.all()
      .then(
        res => dispatchAction(dispatch, fetchWebhooksSuccess(res)),
        err => dispatchAction(dispatch, fetchWebhooksFailure(err))
      )
  }
}

const actions = {
  fetchWebhooks
}

export default actions

