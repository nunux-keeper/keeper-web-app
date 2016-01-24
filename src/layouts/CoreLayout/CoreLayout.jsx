import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AppBar from 'material-ui/lib/app-bar'
import Dialog from 'material-ui/lib/dialog'
import AppNavigation from 'components/AppNavigation'
import { pushPath } from 'redux-simple-router'
import { actions as navigationActions } from '../../redux/modules/navigation'

export class CoreLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    pushPath: PropTypes.func,
    toggleNavigation: PropTypes.func,
    title: PropTypes.string
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

  handleClose () {
    const { returnTo } = this.props.location.state
    this.props.pushPath(returnTo)
  }

  getStyles () {
    const styles = {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: 99,
        top: 0
      }
    }
    return styles
  }

  render () {
    const { location, title, toggleNavigation } = this.props
    const isModal = (location.state && location.state.modal && this.previousChildren)
    const styles = this.getStyles()

    return (
      <div id='layout'>
        <AppBar
          title={title}
          style={styles.appBar}
          onLeftIconButtonTouchTap={() => toggleNavigation()}
          iconClassNameRight='muidocs-icon-navigation-expand-more'
        />
        {isModal ? this.previousChildren : this.props.children }

        {isModal && (
        <Dialog
          title={location.state.title}
          modal={false}
          open
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
  title: state.title
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, navigationActions, {pushPath}), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)

