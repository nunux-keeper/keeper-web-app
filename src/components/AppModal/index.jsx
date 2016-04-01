import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'
import Modal from 'react-modal'

export default class AppModal extends React.Component {
  static propTypes = {
    push: PropTypes.func,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    returnTo: PropTypes.object
  };

  constructor (props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.state = {
      isOpen: false
    }
  }

  componentDidMount () {
    this.setState({isOpen: true})
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
    const { children, title } = this.props
    return (
      <Modal
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}>
        <h3 className='ui top attached header'>
          {title}
        </h3>
        <div className='ui attached segment'>
          {children}
        </div>
        <div className='ui attached segment actions'>
          <div className='ui button'>Cancel</div>
          <div className='ui green button'>Send</div>
        </div>
      </Modal>
    )
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routerActions), dispatch)
)

export default connect(null, mapDispatchToProps)(AppModal)

