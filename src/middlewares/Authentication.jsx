import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'

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
        this.props.dispatch(routeActions.push(`/login?redirect=${redirectAfterLogin}`))
      }
    }

    render () {
      if (this.props.isAuthenticated) {
        return (<Component {...this.props}/>)
      }
    }
  }

  const mapStateToProps = (state) => ({
    location: state.router,
    isAuthenticated: state.auth.user !== null
  })

  return connect(mapStateToProps)(AuthenticatedComponent)
}
