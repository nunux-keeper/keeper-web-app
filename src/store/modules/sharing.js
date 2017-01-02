import { createAction, handleActions } from 'redux-actions'
import SharingApi from 'api/sharing'
import { errorHandler, payloadResponse } from 'store/helper'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_SHARING_LIST = 'FETCH_SHARING_LIST'
export const FETCH_SHARING = 'FETCH_SHARING'
export const CREATE_SHARING = 'CREATE_SHARING'
export const UPDATE_SHARING = 'UPDATE_SHARING'
export const REMOVE_SHARING = 'REMOVE_SHARING'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchSharingListRequest = createAction(FETCH_SHARING_LIST)
export const fetchSharingListFailure = createAction(FETCH_SHARING_LIST, errorHandler)
export const fetchSharingListSuccess = createAction(FETCH_SHARING_LIST, (res) => {
  console.debug('Sharing list fetched:', res.sharing)
  return {response: res.sharing}
})

export const fetchSharingRequest = createAction(FETCH_SHARING)
export const fetchSharingFailure = createAction(FETCH_SHARING, errorHandler)
export const fetchSharingSuccess = createAction(FETCH_SHARING, (sharing) => {
  console.debug('Sharing fetched:', sharing)
  return {response: sharing}
})

export const createSharingRequest = createAction(CREATE_SHARING)
export const createSharingFailure = createAction(CREATE_SHARING, errorHandler)
export const createSharingSuccess = createAction(CREATE_SHARING, (sharing) => {
  console.debug('Sharing created:', sharing.id)
  return {response: sharing}
})

export const updateSharingRequest = createAction(UPDATE_SHARING)
export const updateSharingFailure = createAction(UPDATE_SHARING, errorHandler)
export const updateSharingSuccess = createAction(UPDATE_SHARING, (sharing) => {
  console.debug('Sharing updated:', sharing.id)
  return {response: sharing}
})

export const removeSharingRequest = createAction(REMOVE_SHARING)
export const removeSharingFailure = createAction(REMOVE_SHARING, errorHandler)
export const removeSharingSuccess = createAction(REMOVE_SHARING, (sharing) => {
  console.debug('Sharing removed:', sharing.id)
  return {response: sharing}
})

export const fetchSharingList = () => {
  return (dispatch, getState) => {
    const {sharing} = getState()
    if (sharing.isFetching || sharing.isProcessing) {
      console.warn('Unable to fetch all shring. An action is pending...')
      return Promise.resolve(null)
    } else {
      console.debug('Fetching all sharing')
      dispatch(fetchSharingListRequest())
      return SharingApi.all()
      .then((sharing) => dispatch(fetchSharingListSuccess(sharing)))
      .catch((err) => dispatch(fetchSharingListFailure(err)))
      .then(payloadResponse)
    }
  }
}

export const fetchSharing = () => {
  return (dispatch, getState) => {
    const {sharing, label: {current: label}} = getState()
    if (sharing.isFetching || sharing.isProcessing) {
      console.warn('Unable to fetch sharing. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching sharing of label:', label.id)
    dispatch(fetchSharingRequest())
    return SharingApi.get(label)
    .then((sharing) => dispatch(fetchSharingSuccess(sharing)))
    .catch((err) => dispatch(fetchSharingFailure(err)))
    .then(payloadResponse)
  }
}

export const createSharing = (sharing) => {
  return (dispatch, getState) => {
    const {label: {current: label}} = getState()
    console.debug('Creating sharing:', sharing)
    dispatch(createSharingRequest())
    return SharingApi.create(label, sharing)
    .then((_sharing) => dispatch(createSharingSuccess(_sharing)))
    .catch((err) => dispatch(createSharingFailure(err)))
    .then(payloadResponse)
  }
}

export const updateSharing = (payload) => {
  return (dispatch, getState) => {
    const {sharing, label: {current: label}} = getState()
    if (sharing.isFetching || sharing.isProcessing) {
      console.warn('Unable to update sharing. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Updating sharing:', payload)
    dispatch(updateSharingRequest())
    return SharingApi.update(label, payload)
    .then((_sharing) => dispatch(updateSharingSuccess(_sharing)))
    .catch((err) => dispatch(updateSharingFailure(err)))
    .then(payloadResponse)
  }
}

export const removeSharing = (sharing) => {
  return (dispatch, getState) => {
    console.debug('Removing sharing:', sharing)
    dispatch(removeSharingRequest())
    return SharingApi.remove({id: sharing.targetLabel})
    .then(() => dispatch(removeSharingSuccess(sharing)))
    .catch((err) => dispatch(removeSharingFailure(err)))
    .then(payloadResponse)
  }
}

export const actions = {
  fetchSharingList,
  fetchSharing,
  createSharing,
  updateSharing,
  removeSharing
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_SHARING_LIST]: (state, action) => {
    const update = {
      isProcessing: action.payload == null,
      isFetching: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.items = response
    }
    return Object.assign({}, state, update)
  },
  [FETCH_SHARING]: (state, action) => {
    const update = {
      isProcessing: action.payload == null,
      isFetching: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
    }
    return Object.assign({}, state, update)
  },
  [CREATE_SHARING]: (state, action) => {
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
    }
    return Object.assign({}, state, update)
  },
  [UPDATE_SHARING]: (state, action) => {
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
      const exists = state.items.find((item) => item.id === update.current.id)
      if (exists) {
        // Update item into the list
        update.items = state.items.map((item) => {
          if (item.id === update.current.id) {
            item = update.current
          }
          return item
        })
      }
    }
    return Object.assign({}, state, update)
  },
  [REMOVE_SHARING]: (state, action) => {
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      const sharing = response
      update.items = state.items.filter((item) => item.id !== sharing.id)
      update.current = null
    }
    return Object.assign({}, state, update)
  }
}, {
  isFetching: false,
  isProcessing: false,
  items: [],
  current: null,
  error: null
})
