import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { actions as titleActions } from 'redux/modules/title'

export class HomeView extends React.Component {
  static propTypes = {
    updateTitle: PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.updateTitle('Keeper')
  }

  render () {
    return (
      <div>
        <h1>Welcome to Nunux Keeper</h1>
        <hr />
        <Link to='/login' state={{ modal: true, returnTo: '/', title: 'login' }}>Login</Link>
        <hr />
        <Link to='/404'>Go to 404 Page</Link>
        <hr />
        <Link to='/document'>Go to documents Page</Link>
      </div>
    )
  }
}

export default connect(null, titleActions)(HomeView)
