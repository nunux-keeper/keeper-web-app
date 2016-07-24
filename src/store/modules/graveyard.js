import { createAction, handleActions } from 'redux-actions'
import GraveyardApi from 'api/graveyard'
import { errorHandler, payloadResponse } from 'store/helper'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_GHOSTS = 'FETCH_GHOSTS'
export const REMOVE_GHOST = 'REMOVE_GHOST'
export const RESTORE_DOCUMENT = 'RESTORE_DOCUMENT'
export const EMPTY_GRAVEYARD = 'EMPTY_GRAVEYARD'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchGhostsRequest = createAction(FETCH_GHOSTS, (params) => {
  return {params}
})
export const fetchGhostsFailure = createAction(FETCH_GHOSTS, errorHandler)
export const fetchGhostsSuccess = createAction(FETCH_GHOSTS, (res) => {
  console.debug('Graveyard fetched:', res.total)
  return {response: {total: res.total, items: res.hits}}
})

export const removeGhostRequest = createAction(REMOVE_GHOST)
export const removeGhostFailure = createAction(REMOVE_GHOST, errorHandler)
export const removeGhostSuccess = createAction(REMOVE_GHOST, (ghost) => {
  console.debug('Ghost removed:', ghost.id)
  return {response: ghost}
})

export const emptyGraveyardRequest = createAction(EMPTY_GRAVEYARD)
export const emptyGraveyardFailure = createAction(EMPTY_GRAVEYARD, errorHandler)
export const emptyGraveyardSuccess = createAction(EMPTY_GRAVEYARD, () => {
  console.debug('All ghost removed from the graveyard.')
  return {response: true}
})

export const fetchGhosts = (params = {from: 0, size: 20}) => {
  params = Object.assign({
    from: 0,
    size: 20,
    order: 'desc'
  }, params)
  return (dispatch, getState) => {
    const {graveyard} = getState()
    if (graveyard.isFetching || graveyard.isProcessing) {
      console.warn('Unable to fetch graveyard. An action is pending...')
      return Promise.resolve(null)
    } else if (graveyard.hasMore || params.from === 0) {
      console.debug('Fetching graveyard:', params)
      dispatch(fetchGhostsRequest(params))
      return GraveyardApi.search(params)
      .then((res) => dispatch(fetchGhostsSuccess(res)))
      .catch((err) => dispatch(fetchGhostsFailure(err)))
      .then(payloadResponse)
    } else {
      console.warn('Unable to fetch graveyard. No more ghost.', params)
      return Promise.resolve(null)
    }
  }
}

export const removeGhost = (ghost) => {
  return (dispatch, getState) => {
    console.debug('Removing ghost:', ghost.id)
    dispatch(removeGhostRequest())
    return GraveyardApi.remove(ghost)
    .then(() => dispatch(removeGhostSuccess(ghost)))
    .catch((err) => dispatch(removeGhostFailure(err)))
    .then(payloadResponse)
  }
}

export const emptyGraveyard = () => {
  return (dispatch, getState) => {
    console.debug('Removing all ghosts from the graveyard')
    dispatch(emptyGraveyardRequest())
    return GraveyardApi.empty()
    .then(() => dispatch(emptyGraveyardSuccess()))
    .catch((err) => dispatch(emptyGraveyardFailure(err)))
    .then(payloadResponse)
  }
}

export const actions = {
  fetchGhosts,
  removeGhost,
  emptyGraveyard
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_GHOSTS]: (state, action) => {
    const update = {
      isProcessing: action.payload.params != null,
      isFetching: action.payload.params != null
    }
    const {error, response, params} = action.payload
    if (error) {
      update.error = error
    } else if (response) {
      let {items, total} = response
      update.hasMore = total > items.length
      if (state.params && state.params.from) {
        update.hasMore = total > state.items.length + items.length
        items = state.items.concat(items)
      }
      update.items = items
      update.total = total
    } else if (params) {
      update.params = params
      if (params.from === 0) {
        update.items = []
        update.total = 0
        update.hasMore = false
      }
    }
    return Object.assign({}, state, update)
  },
  [REMOVE_GHOST]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Remove ghost from the list (if present)
      const ghost = response
      const update = {}
      update.items = state.items.reduce((acc, item, index) => {
        if (item.id === ghost.id) {
          update.removedIndex = index
          update.removed = item
          update.total = state.total - 1
        } else {
          acc.push(item)
        }
        return acc
      }, [])
      if (update.removed) {
        return Object.assign({}, state, update)
      }
    }
    return state
  },
  [RESTORE_DOCUMENT]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Remove document from the list (if present)
      const doc = response
      const update = {}
      update.items = state.items.reduce((acc, item, index) => {
        if (item.id === doc.id) {
          update.removedIndex = index
          update.removed = item
          update.total = state.total - 1
        } else {
          acc.push(item)
        }
        return acc
      }, [])
      if (update.removed) {
        return Object.assign({}, state, update)
      }
    }
    return state
  },
  [EMPTY_GRAVEYARD]: (state, action) => {
    const update = {
      isProcessing: action.payload == null,
      isFetching: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.hasMore = false
      update.items = []
      update.total = 0
      update.params = null
    }
    return Object.assign({}, state, update)
  }

}, {
  isFetching: false,
  isProcessing: false,
  hasMore: true,
  removed: null,
  removedIndex: null,
  params: null,
  items: [],
  total: null,
  error: null
})
