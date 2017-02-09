import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { useBasename } from 'history'

import createStore from 'store/createStore'
import makeRoutes from './Routes'

import './styles/main.css'
import 'semantic-ui-css/semantic.min.css'
import 'nprogress/nprogress.css'

import * as NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

// ========================================================
// Store and History Instantiation
// ========================================================
// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the routerKey "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const basename = process.env.PUBLIC_URL || ''
const basenameHistory = useBasename(() => browserHistory)({ basename })
const store = createStore({}, basenameHistory)
const history = syncHistoryWithStore(basenameHistory, store, {
  selectLocationState: (state) => state.router
})
const routes = makeRoutes(store)

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>
    )
  }
}

export default App

