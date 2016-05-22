import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as authActions } from 'redux/modules/auth'

export function requireAuthentication (Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      initAuthentication: PropTypes.func,
      authenticated: PropTypes.bool
    };

    componentWillMount () {
      const {authenticated, initAuthentication} = this.props
      if (!authenticated) {
        initAuthentication()
      }
    }

    render () {
      const {authenticated} = this.props
      return authenticated ? <Component {...this.props}/> : null
    }
  }

  const mapStateToProps = (state) => ({
    authenticated: state.auth.authenticated
  })

  const mapDispatchToProps = (dispatch) => (
    bindActionCreators(Object.assign({}, authActions), dispatch)
  )

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}
