import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import AppNavigation from 'components/AppNavigation'
import AppModal from 'components/AppModal'
import AppNotification from 'components/AppNotification'
import DocumentTitleModal from 'components/DocumentTitleModal'

import '../styles/main.scss'

export class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
  };

  componentWillReceiveProps (nextProps) {
    // if we changed routes...
    if (
      nextProps.location.state &&
      nextProps.location.state.modal
    ) {
      // save the old children (just like animation)
      this.previousChildren = this.props.children
    }
  }

  render () {
    const { location, children } = this.props
    const isModal = (location.state && location.state.modal && this.previousChildren)

    return (
      <div id='main'>
        <div className='ui sidebar large vertical menu'>
          <AppNavigation />
        </div>
        <div className='pusher'>
          {isModal ? this.previousChildren : this.props.children}

          {isModal && (
            <AppModal returnTo={location.state.returnTo}>
              {children}
            </AppModal>
          )}
          <AppNotification />
          <DocumentTitleModal />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

export default connect(mapStateToProps)(MainLayout)

