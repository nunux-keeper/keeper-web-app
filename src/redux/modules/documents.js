import { createAction, handleActions } from 'redux-actions'
import DocumentApi from 'api/document'

import _ from 'lodash'

const errorHandler = function (err) {
  return {error: err}
}

// ------------------------------------
// Constants
// ------------------------------------
export const NEW_DOCUMENT = 'NEW_DOCUMENT'
export const FETCH_DOCUMENT = 'FETCH_DOCUMENT'
export const FETCH_DOCUMENTS = 'FETCH_DOCUMENTS'
export const CREATE_DOCUMENT = 'CREATE_DOCUMENT'
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT'
export const REMOVE_DOCUMENT = 'REMOVE_DOCUMENT'
export const RESTORE_DOCUMENT = 'RESTORE_DOCUMENT'

// ------------------------------------
// Actions
// ------------------------------------
export const newDocument = createAction(NEW_DOCUMENT, (doc) => {
  console.debug('Init. new document:', doc)
  return {response: doc}
})

export const fetchDocumentRequest = createAction(FETCH_DOCUMENT)
export const fetchDocumentFailure = createAction(FETCH_DOCUMENT, errorHandler)
export const fetchDocumentSuccess = createAction(FETCH_DOCUMENT, (doc) => {
  console.debug('Document fetched:', doc.id)
  return {response: doc}
})

export const fetchDocumentsRequest = createAction(FETCH_DOCUMENTS, (params) => {
  return {params}
})
export const fetchDocumentsFailure = createAction(FETCH_DOCUMENTS, errorHandler)
export const fetchDocumentsSuccess = createAction(FETCH_DOCUMENTS, (res) => {
  console.debug('Documents fetched:', res.total)
  return {response: {total: res.total, items: res.hits}}
})

export const createDocumentRequest = createAction(CREATE_DOCUMENT)
export const createDocumentFailure = createAction(CREATE_DOCUMENT, errorHandler)
export const createDocumentSuccess = createAction(CREATE_DOCUMENT, (doc) => {
  console.debug('Document created:', doc.id)
  return {response: doc}
})

export const updateDocumentRequest = createAction(UPDATE_DOCUMENT)
export const updateDocumentFailure = createAction(UPDATE_DOCUMENT, errorHandler)
export const updateDocumentSuccess = createAction(UPDATE_DOCUMENT, (doc) => {
  console.debug('Document updated:', doc.id)
  return {response: doc}
})

export const removeDocumentRequest = createAction(REMOVE_DOCUMENT)
export const removeDocumentFailure = createAction(REMOVE_DOCUMENT, errorHandler)
export const removeDocumentSuccess = createAction(REMOVE_DOCUMENT, (doc) => {
  console.debug('Document removed:', doc.id)
  return {response: doc}
})

export const restoreDocumentRequest = createAction(RESTORE_DOCUMENT)
export const restoreDocumentFailure = createAction(RESTORE_DOCUMENT, errorHandler)
export const restoreDocumentSuccess = createAction(RESTORE_DOCUMENT, (doc) => {
  console.debug('Document restored:', doc.id)
  return {response: doc}
})

export const fetchDocument = (id) => {
  return (dispatch, getState) => {
    console.debug('Fetching document:', id)
    dispatch(fetchDocumentRequest())
    return DocumentApi.get(id)
    .then((doc) => dispatch(fetchDocumentSuccess(doc)))
    .catch((err) => dispatch(fetchDocumentFailure(err)))
  }
}

export const fetchDocuments = (params = {from: 0, size: 20}) => {
  params = Object.assign({
    from: 0,
    size: 20
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
    } else {
      console.warn('Unable to fetch documents. No more documents', params)
      return Promise.resolve(null)
    }
  }
}

export const createDocument = (doc) => {
  return (dispatch, getState) => {
    console.debug('Creating document:', doc)
    dispatch(createDocumentRequest())
    return DocumentApi.create(doc)
    .then((_doc) => dispatch(createDocumentSuccess(_doc)))
    .catch((err) => dispatch(createDocumentFailure(err)))
  }
}

export const updateDocument = (doc, payload) => {
  return (dispatch, getState) => {
    if (doc.id) {
      console.debug('Updating document:', doc.id, payload)
      dispatch(updateDocumentRequest())
      return DocumentApi.update(doc, payload)
      .then((_doc) => dispatch(updateDocumentSuccess(_doc)))
      .catch((err) => dispatch(updateDocumentFailure(err)))
    } else {
      console.debug('Updating new document:', payload)
      return dispatch(updateDocumentSuccess(Object.assign({}, doc, payload)))
    }
  }
}

export const removeDocument = (doc) => {
  return (dispatch, getState) => {
    console.debug('Removing document:', doc.id)
    dispatch(removeDocumentRequest())
    return DocumentApi.remove(doc)
    .then(() => dispatch(removeDocumentSuccess(doc)))
    .catch((err) => dispatch(removeDocumentFailure(err)))
  }
}

export const restoreRemovedDocument = () => {
  return (dispatch, getState) => {
    const {documents} = getState()
    if (!documents.removed) {
      return Promise.reject('No document to restore.')
    }
    console.debug('Restoring document:', documents.removed.id)
    dispatch(restoreDocumentRequest())
    return DocumentApi.restore(documents.removed)
    .then((_doc) => dispatch(restoreDocumentSuccess(_doc)))
    .catch((err) => dispatch(restoreDocumentFailure(err)))
  }
}

export const actions = {
  newDocument,
  fetchDocument,
  fetchDocuments,
  createDocument,
  updateDocument,
  removeDocument,
  restoreRemovedDocument
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [NEW_DOCUMENT]: (state, action) => {
    const update = {
      current: action.payload || {},
      isProcessing: false
    }
    update.current = Object.assign({
      id: null,
      title: 'New document',
      content: '<p>What\'s up ?</p>',
      contentType: 'text/html',
      labels: []
    }, update.current)
    return Object.assign({}, state, update)
  },
  [FETCH_DOCUMENT]: (state, action) => {
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
  [FETCH_DOCUMENTS]: (state, action) => {
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
  [CREATE_DOCUMENT]: (state, action) => {
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
  [UPDATE_DOCUMENT]: (state, action) => {
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
            item.title = update.current.title
            item.labels = update.current.labels
          }
          return item
        })
      }
    }
    return Object.assign({}, state, update)
  },
  [REMOVE_DOCUMENT]: (state, action) => {
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = null
      const doc = response
      const index = _.findIndex(state.items, (item) => item.id === doc.id)
      if (index >= 0) {
        update.items = state.items.filter((item) => item.id !== doc.id)
        update.total = state.total - 1
        update.removed = doc
        update.removedIndex = index
      }
    }
    return Object.assign({}, state, update)
  },
  [RESTORE_DOCUMENT]: (state, action) => {
    const update = {
      isProcessing: action.payload == null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
      update.items = state.items.slice()
      update.items.splice(state.removedIndex, 0, update.current)
      update.total = state.total + 1
      update.removed = null
      update.removedIndex = null
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
  current: null,
  total: null,
  error: null
})
