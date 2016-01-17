import React, { PropTypes } from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import AppBar from 'material-ui/lib/app-bar'
import '../../styles/core.scss'

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
function CoreLayout ({ children }) {
  return (
    <div className='page-container'>
      <AppBar
        title='Title'
        iconClassNameRight='muidocs-icon-navigation-expand-more'
      />
      {children}
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element
}

export default CoreLayout
