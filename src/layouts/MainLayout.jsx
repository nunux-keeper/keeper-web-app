import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dialog from 'material-ui/lib/dialog'
import AppNavigation from 'components/AppNavigation'
import AppNotification from 'components/AppNotification'
import { routerActions } from 'react-router-redux'
import { Sizes } from 'redux/modules/device'

export class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    push: PropTypes.func,
    device: PropTypes.object
  };

  constructor () {
    super()
    this.handleClose = this.handleClose.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.state &&
      nextProps.location.state.modal
    )) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  }

  handleClose () {
    const { returnTo } = this.props.location.state
    this.props.push(returnTo)
  }

  render () {
    const { location, device } = this.props
    const isModal = (location.state && location.state.modal && this.previousChildren)
    const customBodyStyle = {
      maxHeight: 'inherit',
      padding: 0
    }
    const customContentStyle = device.size < Sizes.MEDIUM ? {
      width: 'none',
      maxWidth: 'none'
    } : {}

    return (
      <div>
        {isModal ? this.previousChildren : this.props.children}

        {isModal && (
          <Dialog
            title={location.state.title}
            modal={false}
            open
            autoScrollBodyContent
            autoDetectWindowHeight={false}
            bodyStyle={customBodyStyle}
            contentStyle={customContentStyle}
            onRequestClose={this.handleClose}>
            {this.props.children}
          </Dialog>
        )}
        <AppNavigation />
        <AppNotification />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  device: state.device
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routerActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)

