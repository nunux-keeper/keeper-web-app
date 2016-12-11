import React from 'react'

import AppBar from 'components/AppBar'

import BookmarkletTab from 'views/SettingsView/BookmarkletTab'

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

  get settings () {
    return (
      <div>
        <div className='ui pointing secondary menu' ref='menu'>
          <a className='item active' data-tab='bookmarklet'>
            <h5 className='ui header'>
              <i className='bookmark icon'></i>
              <div className='content'>
                Bookmarklet
                <div className='sub header'>Improve  your browser</div>
              </div>
            </h5>
          </a>
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

