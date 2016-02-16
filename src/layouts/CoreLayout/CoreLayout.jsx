import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AppBar from 'material-ui/lib/app-bar'
import Dialog from 'material-ui/lib/dialog'
import Events from 'material-ui/lib/utils/events'
import AppNavigation from 'components/AppNavigation'
import { pushPath } from 'redux-simple-router'
import { actions as navigationActions } from 'redux/modules/navigation'
import { actions as deviceActions, Sizes } from 'redux/modules/device'

import styles from './CoreLayout.scss'

export class CoreLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    resize: PropTypes.func,
    pushPath: PropTypes.func,
    toggleNavigation: PropTypes.func,
    title: PropTypes.string,
    device: PropTypes.object
  };

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

  componentDidMount () {
    const { resize } = this.props
    Events.on(window, 'resize', resize)
  }

  componentWillUnmount () {
    const { resize } = this.props
    Events.off(window, 'resize', resize)
  }

  handleClose () {
    const { returnTo } = this.props.location.state
    this.props.pushPath(returnTo)
  }

  render () {
    const { location, title, toggleNavigation, device } = this.props
    const isModal = (location.state && location.state.modal && this.previousChildren)
    const customStyle = {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: 99,
        top: 0
      }
    }
    const customBodyStyle = {
      maxHeight: 'inherit',
      padding: 0
    }
    const customContentStyle = device.size < Sizes.MEDIUM ? {
      width: 'none',
      maxWidth: 'none'
    } : {}

    return (
      <div className={styles.layout}>
        <AppBar
          title={title}
          style={customStyle.appBar}
          onLeftIconButtonTouchTap={() => toggleNavigation()}
          iconClassNameRight='muidocs-icon-navigation-expand-more'
        />
        {isModal ? this.previousChildren : this.props.children }

        {isModal && (
        <Dialog
          title={location.state.title}
          modal={false}
          open
          autoScrollBodyContent
          autoDetectWindowHeight={false}
          bodyStyle={customBodyStyle}
          contentStyle={customContentStyle}
          onRequestClose={() => this.handleClose()}>
          {this.props.children}
        </Dialog>
        )}
        <AppNavigation />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router,
  title: state.title,
  device: state.device
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, navigationActions, deviceActions, {pushPath}), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)

