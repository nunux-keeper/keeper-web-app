import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/lib/raised-button'
import { actions as authActions } from 'redux/modules/auth'

export class LoginView extends React.Component {
  static propTypes = {
    loginWith: PropTypes.func.isRequired,
    redirect: PropTypes.string
  };

  render () {
    const { redirect, loginWith } = this.props
    return (
      <div>
        <RaisedButton
          primary
          label='Login with Google'
          onTouchTap={() => loginWith('google', redirect)} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  redirect: state.routing.location.query.next || '/document'
})

export default connect(mapStateToProps, authActions)(LoginView)
