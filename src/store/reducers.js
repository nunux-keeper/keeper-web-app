import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import syncReducers from './modules'

import profile from './profile'
import label from './label'
import webhook from './webhook'
import webhooks from './webhooks'
import exports from './exports'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    router,
    ...syncReducers,
    profile,
    label,
    webhook,
    webhooks,
    exports,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
