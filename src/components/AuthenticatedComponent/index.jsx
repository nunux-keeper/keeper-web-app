import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { pushPath } from 'redux-simple-router'

export function requireAuthentication (Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      dispatch: PropTypes.func,
      location: PropTypes.object,
      isAuthenticated: PropTypes.bool
    };

    componentWillMount () {
      this.checkAuth()
    }

    componentWillReceiveProps (nextProps) {
      this.checkAuth()
    }

    checkAuth () {
      if (!this.props.isAuthenticated) {
        let redirectAfterLogin = this.props.location.path
        this.props.dispatch(pushPath(`/login?redirect=${redirectAfterLogin}`))
      }
    }

    render () {
      return (
        <div>
          {this.props.isAuthenticated ? <Component {...this.props}/> : null }
        </div>
      )
    }
  }

  const mapStateToProps = (state) => ({
    location: state.router,
    isAuthenticated: state.auth.user !== null
  })

  return connect(mapStateToProps)(AuthenticatedComponent)
}
