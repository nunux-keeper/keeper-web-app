import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import routes from 'routes'
import Root from 'containers/Root'
import configureStore from 'redux/configureStore'
import 'styles/main.scss'

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

// Configure store
const store = configureStore(window.__INITIAL_STATE__)

// Render the React application to the DOM
ReactDOM.render(
  <Root routes={routes} store={store} />,
  document.getElementById('root')
)
