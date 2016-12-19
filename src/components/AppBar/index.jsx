import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'

import { routerActions } from 'react-router-redux'
import { actions as layoutActions } from 'store/modules/layout'

import { Sizes } from 'store/modules/layout'

import { Menu } from 'semantic-ui-react'

import './styles.css'

export class AppBar extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.node,
    title: PropTypes.node,
    hideTitleOnMobile: PropTypes.bool,
    modal: PropTypes.bool,
    styles: PropTypes.object,
    location: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: '',
    hideTitleOnMobile: false,
    modal: false
  };

  constructor (props) {
    super(props)
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.handleMenuClick = this.handleMenuClick.bind(this)
  }

  get sidebarIcon () {
    const { modal } = this.props
    if (modal) {
      return (
        <Menu.Item as='a' icon='remove' onClick={this.handleCloseClick} />
      )
    } else {
      const { layout } = this.props
      if (layout.size < Sizes.LARGE) {
        return (
          <Menu.Item as='a' icon='sidebar' onClick={this.handleMenuClick} />
        )
      }
    }
  }

  get title () {
    const { hideTitleOnMobile, title, layout } = this.props
    if (layout.size === Sizes.SMALL && hideTitleOnMobile) {
      return null
    }
    return (
      <Menu.Item name='title' className='title'>
        {title}
      </Menu.Item>
    )
  }

  render () {
    const { children, styles } = this.props
    return (
      <Menu inverted borderless style={styles} id='AppBar'>
        {this.sidebarIcon}
        {this.title}
        {children}
      </Menu>
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
    const {actions} = this.props
    actions.layout.toggleSidebar()
  }
}

const mapStateToProps = (state) => ({
  label: state.label,
  location: state.router.locationBeforeTransitions,
  layout: state.layout
})

const mapActionsToProps = (dispatch) => (bindActions({
  router: routerActions,
  layout: layoutActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(AppBar)
