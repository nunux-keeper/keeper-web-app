import React from 'react'
import { Link } from 'react-router'

export default class HomeView extends React.Component {
  render () {
    return (
      <div>
        <h1>Welcome to Nunux Keeper</h1>
        <hr />
        <Link to={{ pathname: '/login', state: { modal: true, returnTo: '/', title: 'login' } }}>Login</Link>
        <hr />
        <Link to='/404'>Go to 404 Page</Link>
        <hr />
        <Link to='/document'>Go to documents Page</Link>
      </div>
    )
  }
}

