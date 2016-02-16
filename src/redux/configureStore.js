import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import { syncHistory } from 'react-router-redux'
import rootReducer from './rootReducer'
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux'

export default function configureStore (initialState) {
  let createStoreWithMiddleware
  const reduxRouterMiddleware = syncHistory(browserHistory)
  const thunkMiddleware = applyMiddleware(thunk)
  const routerMiddleware = applyMiddleware(reduxRouterMiddleware)

  if (__DEBUG__) {
    createStoreWithMiddleware = compose(
      thunkMiddleware,
      routerMiddleware,
      window.devToolsExtension
        ? window.devToolsExtension()
        : require('containers/DevTools').default.instrument()
    )
  } else {
    createStoreWithMiddleware = compose(thunkMiddleware, routerMiddleware)
  }

  const store = createStoreWithMiddleware(createStore)(
    rootReducer, initialState
  )
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default

      store.replaceReducer(nextRootReducer)
    })
  }
  // Required for replaying actions from devtools to work
  reduxRouterMiddleware.listenForReplays(store)
  return store
}
