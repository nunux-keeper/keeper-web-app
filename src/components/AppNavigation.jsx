import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Divider from 'material-ui/lib/divider'
import { actions as navigationActions } from '../redux/modules/navigation'

import AccountCircle from 'material-ui/lib/svg-icons/action/account-circle'
import ViewModule from 'material-ui/lib/svg-icons/action/view-module'
import Label from 'material-ui/lib/svg-icons/action/label'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Settings from 'material-ui/lib/svg-icons/action/settings'
import Add from 'material-ui/lib/svg-icons/content/add'
import Share from 'material-ui/lib/svg-icons/social/share'

export class AppNavigation extends React.Component {
  static propTypes = {
    toggleNavigation: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  render () {
    const {
      toggleNavigation,
      isOpen
    } = this.props

    return (
      <LeftNav open={isOpen} docked={false} onRequestChange={toggleNavigation}>
        <Link to='/'>
          <MenuItem primaryText='Profile' leftIcon={<AccountCircle />} />
        </Link>
        <Divider />
        <Link to='/document'>
          <MenuItem primaryText='Documents' leftIcon={<ViewModule />} />
        </Link>
        <Divider />
        <span>Labels</span>
        <Link to='/'>
          <MenuItem primaryText='Label A' leftIcon={<Label />} />
        </Link>
        <Link to='/'>
          <MenuItem primaryText='Label B' leftIcon={<Label />} />
        </Link>
        <Link to='/'>
          <MenuItem primaryText='Create label' leftIcon={<Add />} />
        </Link>
        <Divider />
        <Link to='/'>
          <MenuItem primaryText='Trash' leftIcon={<Delete />} />
        </Link>
        <Link to='/'>
          <MenuItem primaryText='Shares' leftIcon={<Share />} />
        </Link>
        <Divider />
        <Link to='/'>
          <MenuItem primaryText='Settings' leftIcon={<Settings />} />
        </Link>
      </LeftNav>
    )
  }
}

const mapStateToProps = (state) => ({
  isOpen: state.navigation.isOpen
})

export default connect(mapStateToProps, navigationActions)(AppNavigation)
