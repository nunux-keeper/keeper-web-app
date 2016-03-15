import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from 'redux/modules/auth'

export class LoginView extends React.Component {
  static propTypes = {
    loginWith: PropTypes.func.isRequired,
    redirect: PropTypes.string
  };

  loginWith (provider) {
    console.log('loginWith', provider)
    const { loginWith, redirect } = this.props
    loginWith(provider, redirect)
  }

  render () {
    const loginWithGoogle = () => this.loginWith('google')
    return (
      <div>
        <button className='ui google plus button' onClick={loginWithGoogle}>
          <i className='google plus icon'></i>
          Login with Google
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  redirect: state.router.locationBeforeTransitions.query.next || '/document'
})

export default connect(mapStateToProps, authActions)(LoginView)
