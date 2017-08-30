import React from 'react'

import AppBar from 'components/AppBar'

import { Tab } from 'semantic-ui-react'

import BookmarkletTab from 'views/SettingsView/BookmarkletTab'
import ApiKeyTab from 'views/SettingsView/ApiKeyTab'

export default class SettingsView extends React.Component {
  componentDidMount () {
    document.title = 'Settings'
  }

  get header () {
    const $title = <span><i className='settings icon'></i>Settings</span>
    return (
      <AppBar title={$title} />
    )
  }

  get panes () {
    return [
      {
        menuItem: { key: 'bm', icon: 'bookmark', content: 'Bookmarklet' },
        render: () => <Tab.Pane><BookmarkletTab /></Tab.Pane>
      },
      {
        menuItem: { key: 'api', icon: 'key', content: 'API key' },
        render: () => <Tab.Pane><ApiKeyTab /></Tab.Pane>
      }
    ]
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='viewContent'>
          <Tab panes={this.panes} />
        </div>
      </div>
    )
  }
}

