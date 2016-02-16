import { createAction, handleActions } from 'redux-actions'
import DocumentApi from 'api/document'

import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'
export const REMOVING_FROM_DOCUMENTS = 'REMOVING_FROM_DOCUMENTS'
export const REMOVED_FROM_DOCUMENTS = 'REMOVED_FROM_DOCUMENTS'
export const RESTORING_FROM_DOCUMENTS = 'RESTORING_FROM_DOCUMENTS'
export const RESTORED_FROM_DOCUMENTS = 'RESTORED_FROM_DOCUMENTS'
export const DISCARD_RESTORED_DOCUMENT = 'DISCARD_RESTORED_DOCUMENT'
export const DISCARD_REMOVED_DOCUMENT = 'DISCARD_REMOVED_DOCUMENT'

// ------------------------------------
// Actions
// ------------------------------------
export const requestDocuments = createAction(REQUEST_DOCUMENTS)
export const receiveDocuments = createAction(RECEIVE_DOCUMENTS, (json) => {
  return {
    documents: json.hits,
    receivedAt: Date.now()
  }
})

export const fetchDocuments = () => {
  return (dispatch, getState) => {
    const {user, query} = getState()
    dispatch(requestDocuments())
    return DocumentApi.getInstance(user).search(query)
    .then(json => dispatch(receiveDocuments(json)))
  }
}

export const removingFromDocuments = createAction(REMOVING_FROM_DOCUMENTS)
export const removedFromDocuments = createAction(REMOVED_FROM_DOCUMENTS, (doc) => {
  console.debug('Document deleted:', doc.id)
  return {
    doc: doc,
    removedAt: Date.now()
  }
})

export const removeFromDocuments = (doc) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(removingFromDocuments())
    return DocumentApi.getInstance(user).remove(doc)
    .then(() => dispatch(removedFromDocuments(doc)))
  }
}

export const restoringFromDocuments = createAction(RESTORING_FROM_DOCUMENTS)
export const restoredFromDocuments = createAction(RESTORED_FROM_DOCUMENTS, (doc) => {
  console.debug('Document restored:', doc.id)
  return {
    doc: doc,
    restoredAt: Date.now()
  }
})

export const restoreFromDocuments = (doc) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(restoringFromDocuments())
    return DocumentApi.getInstance(user).restore(doc)
    .then((_doc) => dispatch(restoredFromDocuments(_doc)))
  }
}

export const discardRemovedDocument = createAction(DISCARD_REMOVED_DOCUMENT)
export const discardRestoredDocument = createAction(DISCARD_RESTORED_DOCUMENT)

export const actions = {
  fetchDocuments,
  removeFromDocuments,
  restoreFromDocuments,
  discardRemovedDocument,
  discardRestoredDocument
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_DOCUMENTS]: (state) => {
    return Object.assign({}, state, {isFetching: true})
  },
  [RECEIVE_DOCUMENTS]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: action.payload.documents,
      lastUpdated: action.payload.receivedAt
    })
  },
  [REMOVING_FROM_DOCUMENTS]: (state) => {
    return Object.assign({}, state, {isProcessing: true})
  },
  [REMOVED_FROM_DOCUMENTS]: (state, action) => {
    const index = _.findIndex(state.items, item => item.id === action.payload.doc.id)
    return Object.assign({}, state, {
      isProcessing: false,
      items: state.items.filter(item => item.id !== action.payload.doc.id),
      removed: action.payload.doc,
      removedIndex: index,
      lastUpdated: action.payload.removedAt
    })
  },
  [RESTORING_FROM_DOCUMENTS]: (state) => {
    return Object.assign({}, state, {isProcessing: true})
  },
  [RESTORED_FROM_DOCUMENTS]: (state, action) => {
    const restoredItems = state.items.slice()
    restoredItems.splice(state.removedIndex, 0, action.payload.doc)
    return Object.assign({}, state, {
      isProcessing: false,
      items: restoredItems,
      removed: null,
      removedIndex: null,
      restored: action.payload.doc,
      lastUpdated: action.payload.restoredAt
    })
  },
  [DISCARD_RESTORED_DOCUMENT]: (state) => {
    return Object.assign({}, state, {restored: null})
  },
  [DISCARD_REMOVED_DOCUMENT]: (state) => {
    return Object.assign({}, state, {removed: null, removedIndex: null})
  }
}, {
  isFetching: false,
  isProcessing: false,
  removed: null,
  removedIndex: null,
  restored: null,
  items: []
})
