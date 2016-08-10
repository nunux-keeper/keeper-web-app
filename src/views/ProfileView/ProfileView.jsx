import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import AppBar from 'components/AppBar'

import BookmarkletTab from 'views/ProfileView/BookmarkletTab/BookmarkletTab'

import moment from 'moment'

export default class ProfileView extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired
  };

  componentDidMount () {
    const $el = this.refs.menu
    window.$($el).find('.item').tab()
    document.title = 'Profile'
  }

  get header () {
    return (
      <AppBar title='Profile' />
    )
  }

  get userHeader () {
    const { isFetching, current } = this.props.profile
    if (isFetching) {
      return (
        <div className='ui active inverted dimmer'>
          <div className='ui large text loader'>Loading</div>
        </div>
      )
    } else if (current) {
      const since = moment(current.date).fromNow(true)
      return (
        <h2 className='ui header'>
          <img
            className='ui circular image'
            src={`http://www.gravatar.com/avatar/${current.hash}`}
          />
          <div className='content'>
            {current.name}
            <div className='sub header'>Member since {since}</div>
          </div>
        </h2>
      )
    }
  }

  get managementLink () {
    return (
      <span>
        Profile management is delegated to an external service. Click&nbsp;
        <a href='http://login.nunux.org/auth/realms/nunux.org/account?referrer=nunux-keeper-app' target='_blank'>
          here
        </a>
        &nbsp;to manage your profile.
      </span>
    )
  }

  get profile () {
    return (
      <div>
        {this.userHeader}
        {this.managementLink}
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
          {this.profile}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile
})

export default connect(mapStateToProps)(ProfileView)
