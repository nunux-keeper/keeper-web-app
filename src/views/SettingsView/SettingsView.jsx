import React from 'react'

import AppBar from 'components/AppBar'

import BookmarkletTab from 'views/SettingsView/BookmarkletTab/BookmarkletTab'

export default class SettingsView extends React.Component {
  componentDidMount () {
    const $el = this.refs.menu
    window.$($el).find('.item').tab()
    document.title = 'Settings'
  }

  get header () {
    return (
      <AppBar title='Settings' />
    )
  }

  get settingsHeader () {
    return (
      <h2 className='ui icon header'>
        <i className='settings icon'></i>
        <div className='content'>
          General Settings
          <div className='sub header'>Manage your settings and set your preferences.</div>
        </div>
      </h2>
    )
  }

  get settings () {
    return (
      <div>
        {this.settingsHeader}
        <div className='ui pointing secondary menu' ref='menu'>
          <a className='item active' data-tab='bookmarklet'>Bookmarklet</a>
        </div>
        <div className='ui bottom attached tab active' data-tab='bookmarklet'>
          <BookmarkletTab active />
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='ui main'>
          {this.settings}
        </div>
      </div>
    )
  }
}

