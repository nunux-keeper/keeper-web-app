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
export const FETCH_WEBHOOK = 'FETCH_WEBHOOK'
export const CREATE_WEBHOOK = 'CREATE_WEBHOOK'
export const UPDATE_WEBHOOK = 'UPDATE_WEBHOOK'
export const REMOVE_WEBHOOK = 'REMOVE_WEBHOOK'
export const RESET_WEBHOOK = 'RESET_WEBHOOK'

// --------------------------------------
// Fetch webhook actions
// --------------------------------------
const fetchWebhookRequest = createRequestAction(FETCH_WEBHOOK)
const fetchWebhookFailure = createFailureAction(FETCH_WEBHOOK)
const fetchWebhookSuccess = createSuccessAction(FETCH_WEBHOOK)

export const fetchWebhook = (id) => {
  return (dispatch, getState) => {
    const { webhook } = getState()
    if (webhook.isProcessing) {
      console.warn('Unable to fetch webhook. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching webhook:', id)
    dispatch(fetchWebhookRequest())
    return WebhookApi.get(id)
      .then(
        res => dispatchAction(dispatch, fetchWebhookSuccess(res)),
        err => dispatchAction(dispatch, fetchWebhookFailure(err))
      )
  }
}

// --------------------------------------
// Create webhook actions
// --------------------------------------
const createWebhookRequest = createRequestAction(CREATE_WEBHOOK)
const createWebhookFailure = createFailureAction(CREATE_WEBHOOK)
const createWebhookSuccess = createSuccessAction(CREATE_WEBHOOK)

export const createWebhook = (webhook) => {
  return (dispatch, getState) => {
    console.debug('Creating webhook:', webhook)
    dispatch(createWebhookRequest())
    return WebhookApi.create(webhook)
      .then(
        res => dispatchAction(dispatch, createWebhookSuccess(res)),
        err => dispatchAction(dispatch, createWebhookFailure(err))
      )
  }
}

// --------------------------------------
// Update webhook actions
// --------------------------------------
const updateWebhookRequest = createRequestAction(UPDATE_WEBHOOK)
const updateWebhookFailure = createFailureAction(UPDATE_WEBHOOK)
const updateWebhookSuccess = createSuccessAction(UPDATE_WEBHOOK)

export const updateWebhook = (update) => {
  return (dispatch, getState) => {
    const { webhook } = getState()
    if (webhook.isProcessing) {
      console.warn('Unable to update webhook. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Updating webhook:', webhook.current)
    dispatch(updateWebhookRequest())
    return WebhookApi.update(webhook.current, update)
      .then(
        res => dispatchAction(dispatch, updateWebhookSuccess(res)),
        err => dispatchAction(dispatch, updateWebhookFailure(err))
      )
  }
}

// --------------------------------------
// Remove webhook actions
// --------------------------------------
const removeWebhookRequest = createRequestAction(REMOVE_WEBHOOK)
const removeWebhookFailure = createFailureAction(REMOVE_WEBHOOK)
const removeWebhookSuccess = createSuccessAction(REMOVE_WEBHOOK)

export const removeWebhook = (webhook) => {
  return (dispatch, getState) => {
    console.debug('Removing webhook:', webhook.id)
    dispatch(removeWebhookRequest())
    return WebhookApi.remove(webhook)
      .then(
        res => dispatchAction(dispatch, removeWebhookSuccess(webhook)),
        err => dispatchAction(dispatch, removeWebhookFailure(err))
      )
  }
}

// --------------------------------------
// Reset webhook action
// --------------------------------------
const resetWebhook = createRequestAction(RESET_WEBHOOK)

const actions = {
  fetchWebhook,
  createWebhook,
  updateWebhook,
  removeWebhook,
  resetWebhook
}

export default actions

