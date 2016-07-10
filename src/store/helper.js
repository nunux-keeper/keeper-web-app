import { bindActionCreators } from 'redux'

export const errorHandler = function (err) {
  return {error: err}
}

export const payloadResponse = function (res) {
  if (res.payload.error) {
    return Promise.reject(res.payload.error)
  } else {
    const payload = res.payload.response || res.payload
    return Promise.resolve(payload)
  }
}

export const bindActions = function (actions, dispatch) {
  const result = Object.keys(actions).reduce((acc, key) => {
    acc[key] = bindActionCreators(actions[key], dispatch)
    return acc
  }, {})
  return {actions: result}
}
