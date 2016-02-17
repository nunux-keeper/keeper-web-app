import React from 'react'
import { Link } from 'react-router'

export default class NotFoundView extends React.Component {
  render () {
    return (
      <div>
        <h1>Page not found!</h1>
        <hr />
        <Link to='/'>Back To Home View</Link>
      </div>
    )
  }
}

