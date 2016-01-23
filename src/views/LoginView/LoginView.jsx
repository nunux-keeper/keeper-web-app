import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/lib/raised-button'
import { actions as authActions } from '../../redux/modules/auth'

export class LoginView extends React.Component {
  static propTypes = {
    loginWith: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.redirect = this.props.location.query.next || '/document'
  }

  render () {
    return (
      <div className='container text-center'>
        <RaisedButton label='Login with Google' primary onTouchTap={() => this.props.loginWith('google', this.redirect)} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  documents: state.documents
})

export default connect(mapStateToProps, authActions)(LoginView)
