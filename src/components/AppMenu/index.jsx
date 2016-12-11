import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { actions as labelsActions } from 'store/modules/labels'
import { Menu, Header, Icon } from 'semantic-ui-react'

import ProfilePanel from 'components/ProfilePanel'

import './styles.css'

export class AppMenu extends React.Component {
  static propTypes = {
    fetchLabels: PropTypes.func.isRequired,
    labels: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentDidMount () {
    const { fetchLabels } = this.props
    fetchLabels()
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
        to={{ pathname: `/label/${label.id}` }} >
        {label.label}
        <Icon name='tag' />
      </Menu.Item>
    )
  }

  render () {
    const {
      location
    } = this.props

    return (
      <Menu fluid vertical id='AppMenu' >
        <Menu.Item header >
          <Header as='h2' icon >
            <Icon name='cloud download' />
            Nunux Keeper
          </Header>
          <ProfilePanel />
        </Menu.Item>
        <Menu.Item as={Link} to={{ pathname: '/document' }}>
          Documents
          <Icon name='grid layout' />
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Labels</Menu.Header>
          <Menu.Menu>
            {this.labels}
            <Menu.Item as={Link}
              to={{ pathname: '/label/create', state: {modal: true, returnTo: location, title: 'Create new label'} }}
              title='Create new label'>
              Create a label
              <Icon name='plus' />
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item as={Link} to={{ pathname: '/trash' }}>
          Trash
          <Icon name='trash' />
        </Menu.Item>
        <Menu.Item as={Link} to={{ pathname: '/settings' }}>
          Settings
          <Icon name='settings' />
        </Menu.Item>
      </Menu>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  labels: state.labels
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, labelsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppMenu)
