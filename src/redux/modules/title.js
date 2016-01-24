import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_TITLE = 'UPDATE_TITLE'

// ------------------------------------
// Actions
// ------------------------------------
export const updateTitle = createAction(UPDATE_TITLE, (value = '') => value)

export const actions = {
  updateTitle
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [UPDATE_TITLE]: (state, {payload}) => {
    document.title = (payload !== '') ? `Keeper - ${payload}` : 'Keeper'
    return payload
  }
}, 'Keeper')
