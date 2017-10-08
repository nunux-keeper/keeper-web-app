import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActions } from 'store/helper'

import AppBar from 'components/AppBar'

import { Tab } from 'semantic-ui-react'

import { routerActions as RouterActions } from 'react-router-redux'

import BookmarkletTab from 'views/SettingsView/BookmarkletTab'
import ApiKeyTab from 'views/SettingsView/ApiKeyTab'
import ExportTab from 'views/SettingsView/ExportTab'
import WebhooksTab from 'views/SettingsView/WebhooksTab'

const PANES = [
  {
    menuItem: { key: 'bookmarklet', icon: 'bookmark', content: 'Bookmarklet' },
    render: () => <Tab.Pane><BookmarkletTab /></Tab.Pane>
  }, {
    menuItem: { key: 'api-key', icon: 'key', content: 'API key' },
    render: () => <Tab.Pane><ApiKeyTab /></Tab.Pane>
  }, {
    menuItem: { key: 'export', icon: 'download', content: 'Export' },
    render: () => <Tab.Pane><ExportTab /></Tab.Pane>
  }, {
    menuItem: { key: 'webhooks', icon: 'send', content: 'Webhooks' },
    render: () => <Tab.Pane><WebhooksTab /></Tab.Pane>
  }
]

class SettingsView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    loc: PropTypes.object.isRequired
  };

  componentDidMount () {
    const title = this.panes[this.activeIndex].menuItem.content
    document.title = `Settings: ${title}`
  }

  handleTabChange = (e, data) => {
    const { actions } = this.props
    const key = this.panes[data.activeIndex].menuItem.key
    const pathname = `/settings/${key}`
    actions.router.push({pathname})
  };

  get header () {
    const $title = <span><i className='settings icon'></i>Settings</span>
    return (
      <AppBar title={$title} />
    )
  }

  get panes () {
    return PANES
  }

  get activeIndex () {
    const { tab } = this.props.params
    const index = this.panes.findIndex(pane => pane.menuItem.key === tab)
    return index < 0 ? 0 : index
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='viewContent'>
          <Tab
            panes={this.panes}
            defaultActiveIndex={this.activeIndex}
            onTabChange={this.handleTabChange}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loc: state.router.locationBeforeTransitions
})

const mapActionsToProps = (dispatch) => (bindActions({
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(SettingsView)
