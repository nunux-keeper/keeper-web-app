import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as notificationActions } from 'store/modules/notification'
import { Message, Button } from 'semantic-ui-react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import './styles.css'

export class AppNotification extends React.Component {
  static propTypes = {
    layout: PropTypes.object.isRequired,
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
        <Message.Header>{header}</Message.Header>
      )
    }
  }

  get actionButton () {
    const { actionLabel } = this.props.notification
    if (actionLabel) {
      return (
        <Button basic inverted size='small' content={actionLabel} onClick={this.handleAction} />
      )
    }
  }

  get styles () {
    const { size } = this.props.layout
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
    this.props.hideNotification()
  }

  render () {
    const { visible, message, level } = this.props.notification
    let component
    if (visible) {
      component = (
        <Message floating attached className={level} onDismiss={this.handleClose} style={this.styles} id='AppNotification' ref='msg'>
          {this.header}
          <div className='content'>
            <p>{message}</p>
            {this.actionButton}
          </div>
        </Message>
      )
    }
    return (
      <ReactCSSTransitionGroup
        transitionName='fade'
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        {component}
      </ReactCSSTransitionGroup>
    )
  }
}

const mapStateToProps = (state) => ({
  notification: state.notification,
  layout: state.layout
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppNotification)
