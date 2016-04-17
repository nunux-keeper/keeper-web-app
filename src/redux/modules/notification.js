import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION'

// ------------------------------------
// Actions
// ------------------------------------
export const showNotification = createAction(SHOW_NOTIFICATION, (notification = {level: 'info'}) => notification)
export const hideNotification = createAction(HIDE_NOTIFICATION)

export const actions = {
  showNotification,
  hideNotification
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SHOW_NOTIFICATION]: (state, {payload}) => {
    const {header, message, level, actionLabel, actionFn} = payload
    return Object.assign({}, state, {
      header, message, level, actionLabel, actionFn
    })
  },
  [HIDE_NOTIFICATION]: (state) => {
    return Object.assign({}, state, {
      header: null,
      message: null,
      level: null,
      actionLabel: null,
      actionFn: null
    })
  }
}, {
  header: null,
  message: null,
  level: null,
  actionLabel: null,
  actionFn: null
})
