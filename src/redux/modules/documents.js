import { createAction, handleActions } from 'redux-actions'
import DocumentApi from '../../api/document'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'

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

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
// NOTE: This is solely for demonstration purposes. In a real application,
// you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
// reducer take care of this logic.
export const fetchDocuments = () => {
  return (dispatch, getState) => {
    const {user, query} = getState()
    dispatch(requestDocuments())
    return DocumentApi.getInstance(user).search(query)
    .then(json => dispatch(receiveDocuments(json)))
  }
}

export const actions = {
  fetchDocuments
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_DOCUMENTS]: (state) => {
    return Object.assign({}, state, {
      isFetching: true
    })
  },
  [RECEIVE_DOCUMENTS]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: action.payload.documents,
      lastUpdated: action.payload.receivedAt
    })
  }
}, {
  isFetching: false,
  items: []
})
