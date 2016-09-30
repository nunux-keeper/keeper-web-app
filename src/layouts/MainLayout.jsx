import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import AppNavigation from 'components/AppNavigation'
import AppModal from 'components/AppModal'
import AppNotification from 'components/AppNotification'
import DocumentTitleModal from 'components/DocumentTitleModal'
import DocumentUrlModal from 'components/DocumentUrlModal'

import { Sizes } from 'store/modules/device'

import '../styles/main.scss'

export class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    device: PropTypes.object.isRequired
  };

  componentWillReceiveProps (nextProps) {
    if (nextProps.location !== this.props.location) {
      // if we changed routes...
      if (
        nextProps.location.state &&
        nextProps.location.state.modal
      ) {
        // save the old children (just like animation)
        this.previousChildren = this.props.children
      } else {
        this.previousChildren = null
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.location !== this.props.location ||
      nextProps.device !== this.props.device
  }

  renderModal () {
    if (this.previousChildren) {
      const { location, children } = this.props
      return (
        <AppModal returnTo={location.state.returnTo}>
          {children}
        </AppModal>
      )
    }
  }

  render () {
    const { children, device } = this.props
    // Navigation bar status depends of the device size.
    const visible = device.size === Sizes.LARGE
    const clazz = visible ? 'pushed' : 'pusher'

    return (
      <div id='main' className='ui pushable'>
        <AppNavigation visible={visible}/>
        <div className={clazz}>
          {this.previousChildren || children}
          {this.renderModal()}
          <AppNotification />
          <DocumentTitleModal />
          <DocumentUrlModal />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  device: state.device
})

export default connect(mapStateToProps)(MainLayout)

