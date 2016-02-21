import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION'

// ------------------------------------
// Actions
// ------------------------------------
export const showNotification = createAction(SHOW_NOTIFICATION, (notification) => notification)
export const discardNotification = createAction(HIDE_NOTIFICATION)

export const actions = {
  showNotification,
  discardNotification
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SHOW_NOTIFICATION]: (state, {payload}) => {
    const {message, actionLabel, actionFn} = payload
    return Object.assign({}, state, {
      message, actionLabel, actionFn
    })
  },
  [HIDE_NOTIFICATION]: (state) => {
    return Object.assign({}, state, {
      message: null,
      actionLabel: null,
      actionFn: null
    })
  }
}, {
  message: null,
  actionLabel: null,
  actionFn: null
})
