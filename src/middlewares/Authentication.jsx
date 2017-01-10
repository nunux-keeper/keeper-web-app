import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as authActions } from 'store/modules/auth'
import { actions as profileActions } from 'store/modules/profile'

export function requireAuthentication (Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      initAuthentication: PropTypes.func.isRequired,
      fetchProfile: PropTypes.func.isRequired,
      profile: PropTypes.object.isRequired,
      authenticated: PropTypes.bool
    };

    componentWillMount () {
      const {authenticated} = this.props
      if (!authenticated) {
        const {initAuthentication, profile} = this.props
        initAuthentication().then((res) => {
          if (res.payload.authenticated) {
            if (!profile.current) {
              const {fetchProfile} = this.props
              fetchProfile()
            }
          } else {
            document.location.replace(window._keycloak.createLoginUrl())
          }
        })
      }
    }

    render () {
      const {authenticated} = this.props
      return authenticated ? <Component {...this.props}/> : null
    }
  }

  const mapStateToProps = (state) => ({
    authenticated: state.auth.authenticated,
    profile: state.profile
  })

  const mapDispatchToProps = (dispatch) => (
    bindActionCreators(Object.assign({}, authActions, profileActions), dispatch)
  )

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent)
}
