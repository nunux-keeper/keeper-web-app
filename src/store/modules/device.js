import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
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

export const actions = {
  resize
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
      size: _getDeviceSize()
    })
  }
}, {
  size: _getDeviceSize()
})
