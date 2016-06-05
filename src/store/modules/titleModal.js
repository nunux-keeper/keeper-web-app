import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_TITLE_MODAL = 'SHOW_TITLE_MODAL'
export const HIDE_TITLE_MODAL = 'HIDE_TITLE_MODAL'

// ------------------------------------
// Actions
// ------------------------------------
export const showTitleModal = createAction(SHOW_TITLE_MODAL, (doc) => doc)
export const hideTitleModal = createAction(HIDE_TITLE_MODAL)

export const actions = {
  showTitleModal,
  hideTitleModal
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SHOW_TITLE_MODAL]: (state, action) => {
    return Object.assign({}, state, {
      content: action.payload
    })
  },
  [HIDE_TITLE_MODAL]: (state, action) => {
    return Object.assign({}, state, {
      content: null
    })
  }
}, {
  content: null
})
