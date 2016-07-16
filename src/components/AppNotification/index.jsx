import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as notificationActions } from 'store/modules/notification'

export class AppNotification extends React.Component {
  static propTypes = {
    device: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    hideNotification: PropTypes.func.isRequired
  };

  constructor () {
    super()
    this.handleAction = this.handleAction.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.timeout = null
  }

  componentDidUpdate (prevProps, prevState) {
    const { header, message, level } = this.props.notification
    if (level !== 'error' && (header || message)) {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.timeout = setTimeout(this.handleClose, 5000)
    }
  }

  get header () {
    const { header } = this.props.notification
    if (header) {
      return (
        <div className='header'>
          {header}
        </div>
      )
    }
  }

  get actionButton () {
    const { actionLabel } = this.props.notification
    if (actionLabel) {
      return (
        <button className='ui small inverted basic button' onClick={this.handleAction}>{actionLabel}</button>
      )
    }
  }

  get styles () {
    const { size } = this.props.device
    return size > 1 ? {
      position: 'fixed',
      bottom: 10,
      left: '50%',
      marginLeft: -200,
      width: 400
    } : {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0
    }
  }

  handleAction (e) {
    const { actionFn } = this.props.notification
    if (actionFn) {
      // this.handleClose(e)
      actionFn()
    }
  }

  handleClose () {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    console.debug('Closing notification...')
    const $msg = this.refs.msg
    window.$($msg).transition({
      animation: 'fade',
      onComplete: this.props.hideNotification
    })
  }

  render () {
    const { header, message, level } = this.props.notification
    if (header || message) {
      return (
        <div className={`ui floating attached ${level} message`} style={this.styles} ref='msg'>
          <i className='close icon' onClick={this.handleClose}></i>
          {this.header}
          <div className='content'>
            <p>
              {message}
            </p>
            {this.actionButton}
          </div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

const mapStateToProps = (state) => ({
  notification: state.notification,
  device: state.device
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppNotification)
