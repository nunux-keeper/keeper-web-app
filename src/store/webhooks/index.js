import { handleActions } from 'redux-actions'

import { commonActionHandler } from 'store/helper'

import { FETCH_WEBHOOKS } from './actions'

import {
  CREATE_WEBHOOK,
  UPDATE_WEBHOOK,
  REMOVE_WEBHOOK
} from '../webhook/actions'

const addToListActionHandler = (state, action) => {
  const { success } = action.meta
  if (success) {
    const update = {
      current: {
        webhooks: [action.payload, ...state.current.webhooks]
      }
    }
    return Object.assign({}, state, update)
  }
  return state
}

const updateListActionHandler = (state, action) => {
  const { success } = action.meta
  if (success) {
    const update = {current: {}}
    let updated = false
    update.current.webhooks = state.current.webhooks.reduce((acc, item, index) => {
      if (item.id === action.payload.id) {
        item = action.payload
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
}

const rmFromListActionHandler = (state, action) => {
  const { success } = action.meta
  if (success) {
    const update = {current: {}}
    let removed = null
    update.current.webhooks = state.current.webhooks.reduce((acc, item, index) => {
      if (item.id === action.payload.id) {
        removed = item
      } else {
        acc.push(item)
      }
      return acc
    }, [])
    if (removed) {
      return Object.assign({}, state, update)
    }
  }
  return state
}

// --------------------------------------
// Reducer
// --------------------------------------
export default handleActions({
  [FETCH_WEBHOOKS]: commonActionHandler,
  [CREATE_WEBHOOK]: addToListActionHandler,
  [UPDATE_WEBHOOK]: updateListActionHandler,
  [REMOVE_WEBHOOK]: rmFromListActionHandler
}, {
  isProcessing: false,
  current: {
    webhooks: []
  },
  error: null
})

