import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActions } from 'store/helper'
import { Menu, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router'

import labelsActions from 'store/labels/actions'
import { actions as layoutActions } from 'store/modules/layout'

import { Sizes } from 'store/modules/layout'

import ProfilePanel from 'components/ProfilePanel'

import './styles.css'

export class AppMenu extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor () {
    super()
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  componentDidMount () {
    const { actions } = this.props
    actions.labels.fetchLabels()
  }

  get spinner () {
    const { isProcessing } = this.props.labels
    if (isProcessing) {
      return (
        <div className='ui active dimmer'>
          <div className='ui loader'></div>
        </div>
      )
    }
  }

  get labels () {
    const { isProcessing, current } = this.props.labels
    if (isProcessing && current.labels.length === 0) {
      return (
        <Menu.Item as='span' >
          <Icon loading name='spinner' />
        </Menu.Item>
      )
    }
    return current.labels.map(
      (label) => <Menu.Item
        as={Link}
        key={`label-${label.id}`}
        onClick={this.handleItemClick}
        title={`View label: ${label.label}`}
        activeClassName='active'
        to={{ pathname: `/labels/${label.id}` }} >
        {this.getLabelIcon(label)}
        {label.label}
      </Menu.Item>
    )
  }

  getLabelIcon (label) {
    if (label.sharing) {
      return (
        <Icon.Group>
          <Icon name='tag' />
          <Icon corner name='share alternate' />
        </Icon.Group>
        )
    } else {
      return (
        <Icon name='tag' />
        )
    }
  }

  handleItemClick (event) {
    // console.log(event)
    const { actions, layout } = this.props
    if (layout.size < Sizes.LARGE) {
      actions.layout.toggleSidebar()
    }
  }

  render () {
    const {
      location
    } = this.props

    return (
      <Menu fluid vertical id='AppMenu'>
        <Menu.Item header >
          <Header as='h2' icon >
            <Icon name='cloud download' />
            Nunux Keeper
          </Header>
          <ProfilePanel />
        </Menu.Item>
        <Menu.Item as={Link}
          title='View all documents [g d]'
          to={{ pathname: '/documents' }}
          activeClassName='active'
          onClick={this.handleItemClick}>
          <Icon name='grid layout'/>
          Documents
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>
            <Icon name='tags' />
            Labels
            <Link
              to={{ pathname: '/labels/create', state: {modal: true, returnTo: location, title: 'Create new label'} }}
              onClick={this.handleItemClick}
              title='Create new label'>
              <Icon link name='add'/>
            </Link>
          </Menu.Header>
          <Menu.Menu>
            {this.labels}
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item as={Link}
          title='View sharing [g r]'
          to={{ pathname: '/sharing' }}
          activeClassName='active'
          onClick={this.handleItemClick}>
          <Icon name='share alternate' />
          Sharing
        </Menu.Item>
        <Menu.Item as={Link}
          title='View trash content [g t]'
          to={{ pathname: '/trash' }}
          activeClassName='active'
          onClick={this.handleItemClick}>
          <Icon name='trash' />
          Trash
        </Menu.Item>
        <Menu.Item as={Link}
          title='View your settings [g s]'
          to={{ pathname: '/settings' }}
          activeClassName='active'
          onClick={this.handleItemClick}>
          <Icon name='settings' />
          Settings
        </Menu.Item>
        <Menu.Item as={Link}
          title='View about screen [g a]'
          to={{ pathname: '/about' }}
          activeClassName='active'
          onClick={this.handleItemClick}>
          <Icon name='question circle outline' />
          About
        </Menu.Item>
      </Menu>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  labels: state.labels,
  layout: state.layout
})

const mapActionsToProps = (dispatch) => (bindActions({
  labels: labelsActions,
  layout: layoutActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(AppMenu)
