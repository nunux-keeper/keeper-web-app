import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const TOGGLE_NAVIGATION = 'TOGGLE_NAVIGATION'

// ------------------------------------
// Actions
// ------------------------------------
export const toggleNavigation = createAction(TOGGLE_NAVIGATION, (open) => open)

export const actions = {
  toggleNavigation
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TOGGLE_NAVIGATION]: (state, {payload}) => {
    return Object.assign({}, state, {
      isOpen: payload || !state.isOpen
    })
  }
}, {
  isOpen: false
})
