import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import AppNavigation from 'components/AppNavigation'
import AppModal from 'components/AppModal'
import AppNotification from 'components/AppNotification'
import DocumentTitleModal from 'components/DocumentTitleModal'
import DocumentUrlModal from 'components/DocumentUrlModal'

import '../styles/main.scss'

export class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object
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
    return nextProps.location !== this.props.location
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
    const { children } = this.props

    // TODO RWD: Replace pusher class by followin style
    // padding-left: 260px;   height: inherit;
    return (
      <div id='main' className='ui pushable'>
        <AppNavigation />
        <div className='pusher'>
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
  location: state.router.locationBeforeTransitions
})

export default connect(mapStateToProps)(MainLayout)

