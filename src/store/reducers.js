import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import syncReducers from './modules'

import profile from './profile'
import exports from './exports'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    router,
    ...syncReducers,
    profile,
    exports,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
