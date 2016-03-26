import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'

export default class AppModal extends React.Component {
  static propTypes = {
    push: PropTypes.func,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    returnTo: PropTypes.string
  };

  constructor () {
    super()
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount () {
    window.$('#mainModal').modal({
      detachable: false,
      context: window.$('#main'),
      onHidden: this.handleClose
    })
    .modal('show')
  }

  handleClose () {
    const { returnTo } = this.props
    if (returnTo) {
      this.props.push({
        pathname: returnTo,
        state: {
          backFromModal: true
        }
      })
    }
  }

  render () {
    const { children, title } = this.props
    return (
      <div id='mainModal' className='ui modal scrolling' >
        <i className='close icon'></i>
        <div className='header'>
          {title}
        </div>
        <div className='content'>
          {children}
        </div>
        <div className='actions'>
          <div className='ui button'>Cancel</div>
          <div className='ui green button'>Send</div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routerActions), dispatch)
)

export default connect(null, mapDispatchToProps)(AppModal)

