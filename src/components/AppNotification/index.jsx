import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as notificationActions } from 'redux/modules/notification'

import Snackbar from 'material-ui/lib/snackbar'

export class AppNotification extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    discardNotification: PropTypes.func.isRequired
  };

  handleActionTouchTap () {
    const { actionFn } = this.props.notification
    if (actionFn) {
      actionFn()
      this.props.discardNotification()
    }
  }

  handleRequestClose () {
    this.props.discardNotification()
  }

  render () {
    const { message, actionLabel } = this.props.notification
    return (
      <Snackbar
        open={ message !== null }
        message={ message || '' }
        action={ actionLabel }
        autoHideDuration={ 4000 }
        onRequestClose={ () => this.handleRequestClose() }
        onActionTouchTap={ () => this.handleActionTouchTap() }
      />
    )
  }
}

const mapStateToProps = (state) => ({
  notification: state.notification
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppNotification)
