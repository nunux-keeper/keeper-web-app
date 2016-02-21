import { createAction, handleActions } from 'redux-actions'
import LabelApi from 'api/label'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_LABEL = 'REQUEST_LABEL'
export const RECEIVE_LABEL = 'RECEIVE_LABEL'
export const DISCARD_LABEL = 'DISCARD_LABEL'
export const CREATING_LABEL = 'CREATING_LABEL'
export const CREATED_LABEL = 'CREATED_LABEL'
export const UPDATING_LABEL = 'UPADTING_LABEL'
export const UPDATED_LABEL = 'UPADTED_LABEL'

// ------------------------------------
// Actions
// ------------------------------------
export const requestLabel = createAction(REQUEST_LABEL)
export const receiveLabel = createAction(RECEIVE_LABEL, (label) => {
  return {
    label: label,
    receivedAt: Date.now()
  }
})

export const fetchLabel = (id) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(requestLabel())
    return LabelApi.getInstance(user).get(id)
    .then(label => dispatch(receiveLabel(label)))
  }
}

export const discardLabel = createAction(DISCARD_LABEL)

export const creatingLabel = createAction(CREATING_LABEL)
export const createdLabel = createAction(CREATED_LABEL, (label) => {
  console.debug('Label created:', label)
  return {
    label: label,
    createdAt: Date.now()
  }
})

export const createLabel = (label) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(creatingLabel())
    return LabelApi.getInstance(user).create(label)
    .then((_label) => dispatch(createdLabel(_label)))
  }
}

export const updatingLabel = createAction(UPDATING_LABEL)
export const updatedLabel = createAction(UPDATED_LABEL, (label) => {
  console.debug('Label updated:', label)
  return {
    label: label,
    updatedAt: Date.now()
  }
})

export const updateLabel = (label) => {
  return (dispatch, getState) => {
    const {user} = getState()
    dispatch(updatingLabel())
    return LabelApi.getInstance(user).update(label, label)
    .then((_label) => dispatch(updatedLabel(_label)))
  }
}

export const actions = {
  fetchLabel,
  discardLabel,
  createLabel,
  updateLabel
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_LABEL]: (state) => {
    return Object.assign({}, state, {isFetching: true})
  },
  [RECEIVE_LABEL]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      value: action.payload.label,
      lastUpdated: action.payload.receivedAt
    })
  },
  [DISCARD_LABEL]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      value: null,
      lastUpdated: null
    })
  },
  [CREATING_LABEL]: (state) => {
    return Object.assign({}, state, {isProcessing: true})
  },
  [CREATED_LABEL]: (state, action) => {
    return Object.assign({}, state, {
      isProcessing: false,
      value: action.payload.label,
      lastUpdated: action.payload.createdAt
    })
  },
  [UPDATING_LABEL]: (state) => {
    return Object.assign({}, state, {isProcessing: true})
  },
  [UPDATED_LABEL]: (state, action) => {
    return Object.assign({}, state, {
      isProcessing: false,
      value: action.payload.label,
      lastUpdated: action.payload.updatedAt
    })
  }
}, {
  isFetching: false,
  isProcessing: false,
  lastUpdated: null,
  value: null
})
