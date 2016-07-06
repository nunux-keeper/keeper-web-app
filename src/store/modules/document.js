import { createAction, handleActions } from 'redux-actions'
import DocumentApi from 'api/document'
import { errorHandler, payloadResponse } from 'store/helper'

// ------------------------------------
// Constants
// ------------------------------------
export const NEW_DOCUMENT = 'NEW_DOCUMENT'
export const FETCH_DOCUMENT = 'FETCH_DOCUMENT'
export const CREATE_DOCUMENT = 'CREATE_DOCUMENT'
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT'
export const REMOVE_DOCUMENT = 'REMOVE_DOCUMENT'
export const RESTORE_DOCUMENT = 'RESTORE_DOCUMENT'
export const EDIT_DOCUMENT = 'EDIT_DOCUMENT'

// ------------------------------------
// Actions
// ------------------------------------
export const newDocument = createAction(NEW_DOCUMENT, (doc) => {
  console.debug('Init. new document:', doc)
  return doc
})

export const fetchDocumentRequest = createAction(FETCH_DOCUMENT)
export const fetchDocumentFailure = createAction(FETCH_DOCUMENT, errorHandler)
export const fetchDocumentSuccess = createAction(FETCH_DOCUMENT, (doc) => {
  console.debug('Document fetched:', doc.id)
  return {response: doc}
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

export const toggleDocumentEditMode = createAction(EDIT_DOCUMENT)

export const fetchDocument = (id) => {
  return (dispatch, getState) => {
    console.debug('Fetching document:', id)
    dispatch(fetchDocumentRequest())
    return DocumentApi.get(id)
    .then((doc) => dispatch(fetchDocumentSuccess(doc)))
    .catch((err) => dispatch(fetchDocumentFailure(err)))
    .then(payloadResponse)
  }
}

export const createDocument = (doc) => {
  return (dispatch, getState) => {
    console.debug('Creating document:', doc)
    dispatch(createDocumentRequest())
    return DocumentApi.create(doc)
    .then((_doc) => dispatch(createDocumentSuccess(_doc)))
    .catch((err) => dispatch(createDocumentFailure(err)))
    .then(payloadResponse)
  }
}

export const updateDocument = (doc, payload) => {
  return (dispatch, getState) => {
    const {isEditing} = getState().document
    if (isEditing) {
      console.debug('Updating document inplace:', payload)
      return dispatch(updateDocumentSuccess(Object.assign({}, doc, payload)))
    } else {
      console.debug('Updating document:', doc.id, payload)
      dispatch(updateDocumentRequest())
      return DocumentApi.update(doc, payload)
      .then((_doc) => dispatch(updateDocumentSuccess(_doc)))
      .catch((err) => dispatch(updateDocumentFailure(err)))
      .then(payloadResponse)
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
    .then(payloadResponse)
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
    .then(payloadResponse)
  }
}

export const submitDocument = () => {
  return (dispatch, getState) => {
    const {current: doc} = getState().document
    if (doc.id) {
      console.debug('Submiting updated document:', doc.id)
      dispatch(updateDocumentRequest())
      // TODO update only modified fields
      return DocumentApi.update(doc, doc)
      .then((_doc) => dispatch(updateDocumentSuccess(_doc)))
      .catch((err) => dispatch(updateDocumentFailure(err)))
      .then(payloadResponse)
    } else {
      console.debug('Submiting new document:', doc)
      dispatch(createDocumentRequest())
      return DocumentApi.create(doc)
      .then((_doc) => dispatch(createDocumentSuccess(_doc)))
      .catch((err) => dispatch(createDocumentFailure(err)))
      .then(payloadResponse)
    }
  }
}

export const resetDocument = () => {
  return (dispatch, getState) => {
    const {current: doc} = getState().document
    if (doc.id) {
      console.debug('Reseting document:', doc.id)
      // TODO avoid fetcing back the doc
      dispatch(fetchDocumentRequest())
      return DocumentApi.get(doc.id)
      .then((doc) => dispatch(fetchDocumentSuccess(doc)))
      .catch((err) => dispatch(fetchDocumentFailure(err)))
      .then(payloadResponse)
    }
  }
}

export const actions = {
  newDocument,
  fetchDocument,
  createDocument,
  updateDocument,
  removeDocument,
  restoreRemovedDocument,
  submitDocument,
  resetDocument,
  toggleDocumentEditMode
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [NEW_DOCUMENT]: (state, action) => {
    const update = {
      current: action.payload || {},
      isProcessing: false,
      isEditing: true
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
      isFetching: action.payload == null,
      isEditing: false,
      current: null
    }
    const {error, response} = action.payload || {}
    if (error) {
      update.error = error
    } else if (response) {
      update.current = response
    }
    return Object.assign({}, state, update)
  },
  [CREATE_DOCUMENT]: (state, action) => {
    const update = {
      isProcessing: action.payload == null,
      isEditing: false,
      current: null
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
    } else {
      // Request
      update.isEditing = false
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
    }
    return Object.assign({}, state, update)
  },
  [EDIT_DOCUMENT]: (state, action) => {
    const update = {
      isEditing: !state.isEditing
    }
    return Object.assign({}, state, update)
  }
}, {
  isFetching: false,
  isProcessing: false,
  isEditing: false,
  current: null,
  error: null
})
