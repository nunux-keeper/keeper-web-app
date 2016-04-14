import { createAction, handleActions } from 'redux-actions'
import DocumentApi from 'api/document'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'
export const UPDATING_DOCUMENT = 'UPDATING_DOCUMENT'
export const UPDATED_DOCUMENT = 'UPDATED_DOCUMENT'
export const REMOVING_DOCUMENT = 'REMOVING_DOCUMENT'
export const REMOVED_DOCUMENT = 'REMOVED_DOCUMENT'

// ------------------------------------
// Actions
// ------------------------------------
export const requestDocument = createAction(REQUEST_DOCUMENT)
export const receiveDocument = createAction(RECEIVE_DOCUMENT, (doc) => {
  return {
    doc: doc,
    receivedAt: Date.now()
  }
})

export const updatingDocument = createAction(UPDATING_DOCUMENT)
export const updatedDocument = createAction(UPDATED_DOCUMENT, (doc) => {
  console.debug('Document updated:', doc.id)
  return {
    doc: doc,
    updatedAt: Date.now()
  }
})

export const removingDocument = createAction(REMOVING_DOCUMENT)
export const removedDocument = createAction(REMOVED_DOCUMENT, (doc) => {
  console.debug('Document deleted:', doc.id)
  return {
    doc: doc,
    removedAt: Date.now()
  }
})

export const fetchDocument = (id) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(requestDocument())
    return DocumentApi.getInstance(user).get(id)
    .then((doc) => dispatch(receiveDocument(doc)))
  }
}

export const updateDocument = (payload) => {
  return (dispatch, getState) => {
    const {user, document: d} = getState()
    dispatch(updatingDocument())
    return DocumentApi.getInstance(user).update(d.value, payload)
    .then((doc) => dispatch(updatedDocument(doc)))
  }
}

export const removeDocument = (doc) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(removingDocument())
    return DocumentApi.getInstance(user).remove(doc)
    .then(() => dispatch(removedDocument(doc)))
  }
}

export const actions = {
  fetchDocument,
  updateDocument,
  removeDocument
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [RECEIVE_DOCUMENT]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      value: action.payload.doc,
      lastUpdated: action.payload.receivedAt
    })
  },
  [UPDATING_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isProcessing: true
    })
  },
  [UPDATED_DOCUMENT]: (state, action) => {
    return Object.assign({}, state, {
      isProcessing: false,
      value: action.payload.doc,
      lastUpdated: action.payload.updatedAt
    })
  }
}, {
  isFetching: false,
  isProcessing: false,
  value: null
})
