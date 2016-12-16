import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_URL_MODAL = 'SHOW_URL_MODAL'
export const HIDE_URL_MODAL = 'HIDE_URL_MODAL'

// ------------------------------------
// Actions
// ------------------------------------
export const showUrlModal = createAction(SHOW_URL_MODAL)
export const hideUrlModal = createAction(HIDE_URL_MODAL)

export const actions = {
  showUrlModal,
  hideUrlModal
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SHOW_URL_MODAL]: (state) => {
    return Object.assign({}, state, {
      open: true
    })
  },
  [HIDE_URL_MODAL]: (state) => {
    return Object.assign({}, state, {
      open: false
    })
  }
}, {
  open: false
})
