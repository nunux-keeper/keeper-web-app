import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Image, Icon } from 'semantic-ui-react'
import { default as Timeago } from 'timeago.js'

import authProvider from 'helpers/AuthProvider'

import './styles.css'

class ProfilePanel extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired
  };

  render () {
    const { current } = this.props.profile
    if (current) {
      const gravatar = `https://www.gravatar.com/avatar/${current.hash}`
      const memberAgo = new Timeago().format(current.date)
      const accountUrl = authProvider.getAccountUrl()
      return (
        <div className='ProfilePanel'>
          <Image avatar src={gravatar} alt='You on Gravatar' />
          <span>
            <strong>{current.name}</strong>
            <small>Member {memberAgo}</small>
          </span>
          <a target='_blank'
            href={accountUrl}
            title='Manage your profile'>
            <Icon name='user' />
          </a>
        </div>
      )
    }
    return <div></div>
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile
})

export default connect(mapStateToProps)(ProfilePanel)
