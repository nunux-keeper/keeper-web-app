import React from 'react'
import ReactDOM from 'react-dom'
import { createHistory, useBasename } from 'history'
import { syncReduxAndRouter } from 'redux-simple-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import routes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

const history = useBasename(createHistory)({
  basename: __BASENAME__
})
const store = configureStore(window.__INITIAL_STATE__)

syncReduxAndRouter(history, store, (state) => state.router)

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
)
