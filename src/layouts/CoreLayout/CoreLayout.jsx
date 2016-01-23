import React, { PropTypes } from 'react'
import AppBar from 'material-ui/lib/app-bar'
import Dialog from 'material-ui/lib/dialog'
import { connect } from 'react-redux'
import { pushPath } from 'redux-simple-router'
import '../../styles/core.scss'

export class CoreLayout extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    children: PropTypes.node,
    location: PropTypes.object
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
    this.props.dispatch(pushPath(returnTo))
  }

  render () {
    let { location } = this.props
    let isModal = (location.state && location.state.modal && this.previousChildren)

    return (
      <div className='page-container'>
        <AppBar
          title='Title'
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
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router
})

export default connect(mapStateToProps)(CoreLayout)

