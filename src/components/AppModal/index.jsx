import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'

import Modal from 'react-modal'

import './styles.scss'

const customStyles = {
  content: {
    padding: 0
  }
}

const customMobileStyles = {
  content: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0
  }
}

export default class AppModal extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    returnTo: PropTypes.object,
    device: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose () {
    const { returnTo, actions } = this.props
    if (returnTo) {
      actions.router.push({
        pathname: returnTo.pathname,
        search: returnTo.search,
        state: {
          backFromModal: true
        }
      })
    }
  }

  render () {
    const { children, device } = this.props
    const styles = device.size === 1 ? customMobileStyles : customStyles
    return (
      <Modal
        isOpen
        style={styles}
        onRequestClose={this.handleClose}>
        {children}
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  device: state.device
})

const mapActionsToProps = (dispatch) => (bindActions({
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(AppModal)

