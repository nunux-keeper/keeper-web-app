import { handleActions } from 'redux-actions'

import { commonActionHandler } from 'store/helper'

import { FETCH_CLIENTS } from './actions'

import {
  CREATE_CLIENT,
  UPDATE_CLIENT,
  REMOVE_CLIENT
} from '../client/actions'

const addToListActionHandler = (state, action) => {
  const { success } = action.meta
  if (success) {
    const update = {
      current: {
        clients: [action.payload, ...state.current.clients]
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
    update.current.clients = state.current.clients.reduce((acc, item, index) => {
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
    update.current.clients = state.current.clients.reduce((acc, item, index) => {
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
  [FETCH_CLIENTS]: commonActionHandler,
  [CREATE_CLIENT]: addToListActionHandler,
  [UPDATE_CLIENT]: updateListActionHandler,
  [REMOVE_CLIENT]: rmFromListActionHandler
}, {
  isProcessing: false,
  current: {
    clients: []
  },
  error: null
})

