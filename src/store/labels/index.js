import { handleActions } from 'redux-actions'

import { commonActionHandler } from 'store/helper'

import { FETCH_LABELS } from './actions'

import {
  CREATE_LABEL,
  UPDATE_LABEL,
  REMOVE_LABEL
} from '../label/actions'

const addToListActionHandler = (state, action) => {
  const { success } = action.meta
  if (success) {
    const update = {
      current: {
        labels: [action.payload, ...state.current.labels]
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
    update.current.labels = state.current.labels.reduce((acc, item, index) => {
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
    update.current.labels = state.current.labels.reduce((acc, item, index) => {
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
  [FETCH_LABELS]: commonActionHandler,
  [CREATE_LABEL]: addToListActionHandler,
  [UPDATE_LABEL]: updateListActionHandler,
  [REMOVE_LABEL]: rmFromListActionHandler
}, {
  isProcessing: false,
  current: {
    labels: []
  },
  error: null
})

