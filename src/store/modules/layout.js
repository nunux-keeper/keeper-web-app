import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBARE'
export const DEVICE_RESIZE = 'DEVICE_RESIZE'
export const Sizes = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3
}

// ------------------------------------
// Actions
// ------------------------------------
export const resize = createAction(DEVICE_RESIZE)
export const toggleSidebar = createAction(TOGGLE_SIDEBAR)

export const actions = {
  resize,
  toggleSidebar
}

// ------------------------------------
// Functions
// ------------------------------------
function _getDeviceSize () {
  const width = window.innerWidth
  if (width >= 992) {
    return Sizes.LARGE
  } else if (width >= 768) {
    return Sizes.MEDIUM
  } else { // width < 768
    return Sizes.SMALL
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [DEVICE_RESIZE]: (state) => {
    return Object.assign({}, state, {
      size: _getDeviceSize(),
      sidebar: {
        visible: _getDeviceSize() === Sizes.LARGE
      }
    })
  },
  [TOGGLE_SIDEBAR]: (state) => {
    return Object.assign({}, state, {
      sidebar: {
        visible: !state.sidebar.visible
      }
    })
  }

}, {
  size: _getDeviceSize(),
  sidebar: {
    visible: _getDeviceSize() === Sizes.LARGE
  }
})
