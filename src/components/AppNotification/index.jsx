import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as notificationActions } from 'store/modules/notification'

export class AppNotification extends React.Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    hideNotification: PropTypes.func.isRequired
  };

  constructor () {
    super()
    this.handleAction = this.handleAction.bind(this)
    this.handleClose = this.handleClose.bind(this)
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
        <button className='ui compact button' onClick={this.handleAction}>{actionLabel}</button>
      )
    }
  }

  get styles () {
    return {
      position: 'fixed',
      bottom: 10,
      left: '50%',
      marginLeft: -200,
      width: 400
    }
  }

  handleAction (e) {
    const { actionFn } = this.props.notification
    if (actionFn) {
      // this.handleClose(e)
      actionFn()
    }
  }

  handleClose (e) {
    window.$(e.target).closest('.message').transition({
      animation: 'fade',
      onComplete: this.props.hideNotification
    })
  }

  render () {
    const { header, message, level } = this.props.notification
    if (header || message) {
      return (
        <div className={`ui floating attached ${level} message`} style={this.styles}>
          <i className='close icon' onClick={this.handleClose}></i>
          <div className='content'>
            {this.header}
            <p>
              {message}
            </p>
          </div>
          {this.actionButton}
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

const mapStateToProps = (state) => ({
  notification: state.notification
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppNotification)
