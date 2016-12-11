import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'

import Modal from 'react-modal'

import './styles.css'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.90)'
  },
  content: {
    padding: 0,
    right: 'initial',
    left: 'calc(50% - 450px)',
    width: '900px',
    border: '1px solid #4c4c4c'
  }
}

const customMobileStyles = {
  content: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    border: 'none',
    borderRadius: 'initial'
  }
}

export class AppModal extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    returnTo: PropTypes.object,
    layout: PropTypes.object.isRequired
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
    const { children, layout } = this.props
    const styles = layout.size === 1 ? customMobileStyles : customStyles
    return (
      <Modal
        isOpen
        style={styles}
        onRequestClose={this.handleClose}
        contentLabel='Modal'>
        {children}
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  layout: state.layout
})

const mapActionsToProps = (dispatch) => (bindActions({
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(AppModal)

