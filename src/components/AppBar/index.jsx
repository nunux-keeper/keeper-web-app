import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'

export class AppBar extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.node,
    contextMenu: PropTypes.node,
    title: PropTypes.node.isRequired,
    modal: PropTypes.bool,
    styles: PropTypes.object,
    location: PropTypes.object.isRequired
  };

  static defaultProps = {
    modal: false
  };

  constructor (props) {
    super(props)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handleMenuClick = this.handleMenuClick.bind(this)
  }

  componentDidMount () {
    const $el = this.refs.bar
    window.$($el).find('.dropdown').dropdown({
      transition: 'drop'
    })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.contextMenu !== this.props.contextMenu) {
      const $el = this.refs.bar
      window.$($el).find('.dropdown').dropdown({
        transition: 'drop'
      })
    }
  }

  get sidebarIcon () {
    const { modal } = this.props
    if (modal) {
      return (
        <a className='item' onClick={this.handleCloseClick}>
          <i className='remove icon'></i>
        </a>
      )
    } else {
      return (
        <a className='item' onClick={this.handleMenuClick}>
          <i className='sidebar icon'></i>
        </a>
      )
    }
  }

  get contextMenu () {
    const { contextMenu } = this.props
    if (contextMenu) {
      return (
        <div className='ui dropdown icon right item'>
          <i className='ellipsis vertical icon'></i>
          {contextMenu}
        </div>
      )
    }
  }

  render () {
    const { children, styles, title } = this.props
    return (
      <div className='ui top inverted menu' style={styles} ref='bar'>
        {this.sidebarIcon}
        <div className='header item' title={title}>
          <span>{title}</span>
        </div>
        <div className='right menu'>
          {children}
          {this.contextMenu}
        </div>
      </div>
    )
  }

  handleCloseClick () {
    const {actions, location} = this.props
    if (location.state.returnTo) {
      const {pathname, search} = location.state.returnTo
      actions.router.push({
        pathname: pathname,
        search: search,
        state: {
          backFromModal: true
        }
      })
    }
  }

  handleMenuClick () {
    window.$('.ui.sidebar').sidebar({
      context: window.$('#main')
    }).sidebar('toggle')
  }
}

const mapStateToProps = (state) => ({
  label: state.label,
  location: state.router.locationBeforeTransitions
})

const mapActionsToProps = (dispatch) => (bindActions({
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(AppBar)
