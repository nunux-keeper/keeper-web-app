import { createAction, handleActions } from 'redux-actions'
import DocumentApi from 'api/document'

import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const CREATING_DOCUMENT = 'CREATING_DOCUMENT'
export const CREATED_DOCUMENT = 'CREATED_DOCUMENT'
export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'
export const UPDATING_DOCUMENT = 'UPDATING_DOCUMENT'
export const UPDATED_DOCUMENT = 'UPDATED_DOCUMENT'
export const REMOVING_DOCUMENT = 'REMOVING_DOCUMENT'
export const REMOVED_DOCUMENT = 'REMOVED_DOCUMENT'
export const RESTORING_DOCUMENT = 'RESTORING_DOCUMENT'
export const RESTORED_DOCUMENT = 'RESTORED_DOCUMENT'

export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'

// ------------------------------------
// Actions
// ------------------------------------
export const creatingDocument = createAction(CREATING_DOCUMENT)
export const createdDocument = createAction(CREATED_DOCUMENT, (doc) => {
  console.debug('Document created:', doc.id)
  return doc
})

export const requestDocument = createAction(REQUEST_DOCUMENT)
export const receiveDocument = createAction(RECEIVE_DOCUMENT, (doc) => {
  console.debug('Document fetched:', doc.id)
  return doc
})

export const updatingDocument = createAction(UPDATING_DOCUMENT)
export const updatedDocument = createAction(UPDATED_DOCUMENT, (doc) => {
  console.debug('Document updated:', doc.id)
  return doc
})

export const removingDocument = createAction(REMOVING_DOCUMENT)
export const removedDocument = createAction(REMOVED_DOCUMENT, (doc) => {
  console.debug('Document deleted:', doc.id)
  return doc
})

export const restoringDocument = createAction(RESTORING_DOCUMENT)
export const restoredDocument = createAction(RESTORED_DOCUMENT, (doc) => {
  console.debug('Document restored:', doc.id)
  return doc
})

export const requestDocuments = createAction(REQUEST_DOCUMENTS)
export const receiveDocuments = createAction(RECEIVE_DOCUMENTS, (res) => {
  console.debug('Document(s) fetched:', res.total)
  return {
    total: res.total,
    items: res.hits
  }
})

export const createDocument = (doc) => {
  return (dispatch, getState) => {
    const {user} = getState()
    console.debug('Creating document:', doc)
    dispatch(creatingDocument())
    if (doc.url) {
      return DocumentApi.getInstance(user).create(doc)
      .then((_doc) => dispatch(createdDocument(_doc)))
    } else {
      return dispatch(createdDocument(doc))
    }
  }
}

export const fetchDocument = (id) => {
  return (dispatch, getState) => {
    const {user} = getState()
    console.debug('Fetching document:', id)
    dispatch(requestDocument())
    return DocumentApi.getInstance(user).get(id)
    .then((doc) => dispatch(receiveDocument(doc)))
  }
}

export const updateDocument = (doc, payload) => {
  return (dispatch, getState) => {
    const {user} = getState()
    console.debug('Updating document:', doc.id, payload)
    dispatch(updatingDocument())
    if (doc.id) {
      return DocumentApi.getInstance(user).update(doc, payload)
      .then((_doc) => dispatch(updatedDocument(_doc)))
    } else {
      return dispatch(updatedDocument(Object.assign({}, doc, payload)))
    }
  }
}

export const removeDocument = (doc) => {
  return (dispatch, getState) => {
    const {user} = getState()
    console.debug('Removing document:', doc.id)
    dispatch(removingDocument())
    return DocumentApi.getInstance(user).remove(doc)
    .then(() => dispatch(removedDocument(doc)))
  }
}

export const restoreRemovedDocument = () => {
  return (dispatch, getState) => {
    const {user, documents} = getState()
    if (!documents.removed) {
      return Promise.reject('No document to restore.')
    }
    console.debug('Restoring document:', documents.removed.id)
    dispatch(restoringDocument())
    return DocumentApi.getInstance(user).restore(documents.removed)
    .then((_doc) => dispatch(restoredDocument(_doc)))
  }
}

export const fetchDocuments = (params = {from: 0, size: 20}) => {
  params = Object.assign({
    from: 0,
    size: 20
  }, params)
  return (dispatch, getState) => {
    const {user, documents} = getState()
    if (documents.isFetching || documents.isProcessing) {
      console.warn('Unable to fetch documents. An action is pending...')
      return Promise.resolve(null)
    } else if (documents.hasMore || params.from === 0) {
      console.debug('Fetching documents:', params)
      dispatch(requestDocuments(params))
      return DocumentApi.getInstance(user).search(params)
      .then((res) => dispatch(receiveDocuments(res)))
    } else {
      console.warn('Unable to fetch documents. No more documents', params)
      return Promise.resolve(null)
    }
  }
}

export const actions = {
  createDocument,
  fetchDocument,
  updateDocument,
  removeDocument,
  restoreRemovedDocument,
  fetchDocuments
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [CREATING_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isProcessing: true
    })
  },
  [CREATED_DOCUMENT]: (state, action) => {
    let doc = action.payload
    if (!doc || !doc.id) {
      const defaultDoc = {
        id: null,
        title: 'New document',
        content: '<p>What\'s up ?</p>',
        contentType: 'text/html',
        labels: []
      }
      doc = Object.assign({}, defaultDoc, doc || {})
    }
    return Object.assign({}, state, {
      current: doc,
      isProcessing: false
    })
  },
  [REQUEST_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [RECEIVE_DOCUMENT]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      current: action.payload
    })
  },
  [UPDATING_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isProcessing: true
    })
  },
  [UPDATED_DOCUMENT]: (state, action) => {
    const update = {
      isProcessing: false,
      current: action.payload
    }
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
    return Object.assign({}, state, update)
  },
  [REQUEST_DOCUMENTS]: (state, action) => {
    return Object.assign({}, state, {
      params: action.payload,
      isFetching: true
    })
  },
  [REMOVING_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isProcessing: true
    })
  },
  [REMOVED_DOCUMENT]: (state, action) => {
    const doc = action.payload
    const index = _.findIndex(state.items, (item) => item.id === doc.id)
    return Object.assign({}, state, {
      isProcessing: false,
      items: state.items.filter((item) => item.id !== doc.id),
      total: state.total - 1,
      removed: doc,
      removedIndex: index,
      current: null
    })
  },
  [RESTORING_DOCUMENT]: (state) => {
    return Object.assign({}, state, {
      isProcessing: true
    })
  },
  [RESTORED_DOCUMENT]: (state, action) => {
    const doc = action.payload
    const restoredItems = state.items.slice()
    restoredItems.splice(state.removedIndex, 0, doc)
    return Object.assign({}, state, {
      isProcessing: false,
      items: restoredItems,
      total: state.total + 1,
      removed: null,
      removedIndex: null,
      current: doc
    })
  },
  [RECEIVE_DOCUMENTS]: (state, action) => {
    let {items, total} = action.payload
    let hasMore = total > items.length
    if (state.params && state.params.from) {
      hasMore = total > state.items.length + items.length
      items = state.items.concat(items)
    }

    return Object.assign({}, state, {
      isFetching: false,
      hasMore: hasMore,
      items: items,
      total: total
    })
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
  total: null
})
