import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import LeftNav from 'material-ui/lib/left-nav'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Divider from 'material-ui/lib/divider'
import { actions as navigationActions } from 'redux/modules/navigation'
import { actions as labelsActions } from 'redux/modules/labels'

import AccountCircle from 'material-ui/lib/svg-icons/action/account-circle'
import ViewModule from 'material-ui/lib/svg-icons/action/view-module'
import Label from 'material-ui/lib/svg-icons/action/label'
import Delete from 'material-ui/lib/svg-icons/action/delete'
import Settings from 'material-ui/lib/svg-icons/action/settings'
import Add from 'material-ui/lib/svg-icons/content/add'
import Share from 'material-ui/lib/svg-icons/social/share'
import CircularProgress from 'material-ui/lib/circular-progress'
import LinearProgress from 'material-ui/lib/linear-progress'

import styles from './styles.scss'

export class AppNavigation extends React.Component {
  static propTypes = {
    toggleNavigation: PropTypes.func.isRequired,
    fetchLabels: PropTypes.func.isRequired,
    removeFromLabels: PropTypes.func.isRequired,
    restoreFromLabels: PropTypes.func.isRequired,
    discardRestoredLabel: PropTypes.func.isRequired,
    discardRemovedLabel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    labels: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor () {
    super()
    this.handleNavItemTouchTap = this.handleNavItemTouchTap.bind(this)
    this.handleNavRequestChange = this.handleNavRequestChange.bind(this)
  }

  componentDidMount () {
    const { fetchLabels } = this.props
    fetchLabels()
  }

  get spinner () {
    const { isFetching, items } = this.props.labels
    if (isFetching) {
      if (items.length) {
        return (
          <LinearProgress mode='indeterminate'/>
        )
      } else {
        return (
          <CircularProgress />
        )
      }
    }
  }

  get labels () {
    const { labels } = this.props
    const items = this.props.labels.items.map(
      (label) => <Link
        key={`label-${label.id}`}
        to={{pathname: `/label/${label.id}`}}
        onTouchTap={this.handleNavItemTouchTap}
        >
        <MenuItem primaryText={label.label} leftIcon={<Label />} />
      </Link>
    )
    if (items.length) {
      return items
    } else if (!labels.isFetching) {
      return (
        <p>No labels :(</p>
      )
    }
  }

  handleNavItemTouchTap () {
    const { toggleNavigation } = this.props
    toggleNavigation(false)
  }

  handleNavRequestChange (change) {
    const { toggleNavigation } = this.props
    toggleNavigation(change)
  }

  render () {
    const {
      isOpen,
      location
    } = this.props

    return (
      <LeftNav open={isOpen} docked={false} onRequestChange={this.handleNavRequestChange} className={styles.navigation}>
        <Link to={{ pathname: '/' }}>
          <MenuItem primaryText='Profile'
            leftIcon={<AccountCircle />}
            onTouchTap={this.handleNavItemTouchTap}
          />
        </Link>
        <Divider />
        <Link to={{ pathname: '/document' }}>
          <MenuItem primaryText='Documents'
            leftIcon={<ViewModule />}
            onTouchTap={this.handleNavItemTouchTap}
          />
        </Link>
        <Divider />
        <span className={styles.label}>Labels</span>
        {this.labels}
        <Link
          to={{ pathname: '/label/create', state: {modal: true, returnTo: location.pathname, title: 'Create new label'} }}
          title='Create new label'>
          <MenuItem primaryText='Create label'
            leftIcon={<Add />}
            onTouchTap={this.handleNavItemTouchTap}
          />
        </Link>
        <Divider />
        <Link to={{ pathname: '/' }}>
          <MenuItem primaryText='Trash'
            leftIcon={<Delete />}
          />
        </Link>
        <Link to={{ pathname: '/' }}>
          <MenuItem primaryText='Shares'
            leftIcon={<Share />}
          />
        </Link>
        <Divider />
        <Link to={{ pathname: '/' }}>
          <MenuItem primaryText='Settings'
            leftIcon={<Settings />}
          />
        </Link>
      </LeftNav>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  isOpen: state.navigation.isOpen,
  labels: state.labels
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, labelsActions, navigationActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation)
