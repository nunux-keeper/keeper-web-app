import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'

import styles from './styles.scss'

class ProfilePanel extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired
  };

  render () {
    const { current } = this.props.profile
    if (current) {
      const gravatar = `https://www.gravatar.com/avatar/${current.hash}`
      const since = moment(current.date).fromNow(true)
      return (
        <div className={styles.profile}>
          <img className='ui avatar image' src={gravatar} />
          <span>
            <strong>{current.name}</strong>
            <small>Member since {since}</small>
          </span>
          <a
            target='_blank'
            href='https://login.nunux.org/auth/realms/nunux.org/account?referrer=nunux-keeper-app'
            title='Manage your profile'
          >
            <i className='icon user'></i>
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
