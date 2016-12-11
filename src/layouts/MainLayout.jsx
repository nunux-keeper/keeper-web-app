import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import AppMenu from 'components/AppMenu'
import AppModal from 'components/AppModal'
import AppNotification from 'components/AppNotification'
import DocumentTitleModal from 'components/DocumentTitleModal'
import DocumentUrlModal from 'components/DocumentUrlModal'
import { Sizes } from 'store/modules/layout'
import { Sidebar } from 'semantic-ui-react'

import './styles.css'

export class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    layout: PropTypes.object.isRequired
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
      nextProps.layout !== this.props.layout
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

  renderMobileLayout () {
    const { children, layout } = this.props

    return (
      <Sidebar.Pushable id='MobileLayout'>
        <Sidebar animation='push' visible={layout.sidebar.visible} >
          <AppMenu />
        </Sidebar>
        <Sidebar.Pusher>
          <div>
            {this.previousChildren || children}
            {this.renderModal()}
            <AppNotification />
            <DocumentTitleModal />
            <DocumentUrlModal />
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }

  renderDesktopLayout () {
    const { children } = this.props

    return (
      <div id='DesktopLayout'>
        <AppMenu />
        <div className='main'>
          {this.previousChildren || children}
          {this.renderModal()}
          <AppNotification />
          <DocumentTitleModal />
          <DocumentUrlModal />
        </div>
      </div>
    )
  }

  render () {
    const { layout } = this.props
    return layout.size < Sizes.LARGE ? this.renderMobileLayout() : this.renderDesktopLayout()
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  layout: state.layout
})

export default connect(mapStateToProps)(MainLayout)

