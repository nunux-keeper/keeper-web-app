import { createAction, handleActions } from 'redux-actions'
import DocumentApi from 'api/document'
import { errorHandler, payloadResponse } from 'store/helper'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_DOCUMENTS = 'FETCH_DOCUMENTS'
export const CREATE_DOCUMENT = 'CREATE_DOCUMENT'
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT'
export const REMOVE_DOCUMENT = 'REMOVE_DOCUMENT'
export const RESTORE_DOCUMENT = 'RESTORE_DOCUMENT'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchDocumentsRequest = createAction(FETCH_DOCUMENTS, (params) => {
  return {params}
})
export const fetchDocumentsFailure = createAction(FETCH_DOCUMENTS, errorHandler)
export const fetchDocumentsSuccess = createAction(FETCH_DOCUMENTS, (res) => {
  console.debug('Documents fetched:', res.total)
  return {response: {total: res.total, items: res.hits}}
})

export const fetchDocuments = (params = {from: 0, size: 20}) => {
  params = Object.assign({
    from: 0,
    size: 20,
    order: 'desc'
  }, params)
  return (dispatch, getState) => {
    const {documents} = getState()
    if (documents.isFetching || documents.isProcessing) {
      console.warn('Unable to fetch documents. An action is pending...')
      return Promise.resolve(null)
    } else if (documents.hasMore || params.from === 0) {
      console.debug('Fetching documents:', params)
      dispatch(fetchDocumentsRequest(params))
      return DocumentApi.search(params)
      .then((res) => dispatch(fetchDocumentsSuccess(res)))
      .catch((err) => dispatch(fetchDocumentsFailure(err)))
      .then(payloadResponse)
    } else {
      console.warn('Unable to fetch documents. No more documents', params)
      return Promise.resolve(null)
    }
  }
}

export const actions = {
  fetchDocuments
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCH_DOCUMENTS]: (state, action) => {
    const update = {
      isProcessing: action.payload.params != null,
      isFetching: action.payload.params != null
    }
    const {error, response, params} = action.payload
    if (error) {
      update.error = error
    } else if (response) {
      const {items, total} = response
      update.total = total
      update.items = state.items.concat(items)
      update.hasMore = total > update.items.length
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
  [CREATE_DOCUMENT]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Add created document to the list
      const update = {
        items: [response, ...state.items],
        total: state.total + 1
      }
      return Object.assign({}, state, update)
    }
    return state
  },
  [UPDATE_DOCUMENT]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Update document into the list (if present)
      const doc = response
      const update = {}
      let updated = false
      update.items = state.items.reduce((acc, item, index) => {
        if (item.id === doc.id) {
          item.title = doc.title
          item.labels = doc.labels
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
  },
  [REMOVE_DOCUMENT]: (state, action) => {
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
  [RESTORE_DOCUMENT]: (state, action) => {
    const {response} = action.payload || {}
    if (response) {
      // Restore document into the list
      const idx = state.removedIndex || 0
      const update = {}
      update.items = state.items.slice()
      update.items.splice(idx, 0, response)
      update.total = state.total + 1
      update.removed = null
      update.removedIndex = null
      return Object.assign({}, state, update)
    }
    return state
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
