import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActions } from 'store/helper'
import { Menu, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router'

import { actions as labelsActions } from 'store/modules/labels'
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
    const { isFetching } = this.props.labels
    if (isFetching) {
      return (
        <div className='ui active dimmer'>
          <div className='ui loader'></div>
        </div>
      )
    }
  }

  get labels () {
    const { labels } = this.props
    if (labels.isFetching && labels.items.length === 0) {
      return (
        <Menu.Item as='span' >
          <Icon loading name='spinner' />
        </Menu.Item>
      )
    }
    return labels.items.map(
      (label) => <Menu.Item
        as={Link}
        key={`label-${label.id}`}
        onClick={this.handleItemClick}
        to={{ pathname: `/label/${label.id}` }} >
        {label.label}
        <Icon name='tag' />
      </Menu.Item>
    )
  }

  handleItemClick (event) {
    console.log(event)
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
        <Menu.Item as={Link} to={{ pathname: '/document' }} onClick={this.handleItemClick}>
          Documents
          <Icon name='grid layout' />
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Labels</Menu.Header>
          <Menu.Menu>
            {this.labels}
            <Menu.Item as={Link}
              to={{ pathname: '/label/create', state: {modal: true, returnTo: location, title: 'Create new label'} }}
              onClick={this.handleItemClick}
              title='Create new label'>
              Create a label
              <Icon name='plus' />
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item as={Link} to={{ pathname: '/trash' }} onClick={this.handleItemClick}>
          Trash
          <Icon name='trash' />
        </Menu.Item>
        <Menu.Item as={Link} to={{ pathname: '/settings' }} onClick={this.handleItemClick}>
          Settings
          <Icon name='settings' />
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
