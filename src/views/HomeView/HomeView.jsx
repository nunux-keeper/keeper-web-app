import React from 'react'
import { Link } from 'react-router'

export default class HomeView extends React.Component {
  render () {
    return (
      <div>
        <h1>Welcome to Nunux Keeper</h1>
        <hr />
        <Link to='/document'>View my documents</Link>
      </div>
    )
  }
}

