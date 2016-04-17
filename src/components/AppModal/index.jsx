import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'
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
    push: PropTypes.func,
    children: PropTypes.node.isRequired,
    returnTo: PropTypes.object,
    device: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose () {
    const { returnTo } = this.props
    if (returnTo) {
      this.props.push({
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

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routerActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppModal)

