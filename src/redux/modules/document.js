import { createAction, handleActions } from 'redux-actions'
import DocumentApi from '../../api/document'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'

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

export const fetchDocument = (id) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(requestDocument())
    return DocumentApi.getInstance(user).get(id)
    .then(doc => dispatch(receiveDocument(doc)))
  }
}

export const actions = {
  fetchDocument
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
  }
}, {
  isFetching: false,
  value: null
})
