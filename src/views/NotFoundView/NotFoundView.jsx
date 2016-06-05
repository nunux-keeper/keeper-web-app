import React from 'react'
import { Link } from 'react-router'

export const NotFoundView = (props) => (
  <div>
    <h1>Page not found!</h1>
    <hr />
    <Link to='/'>Back To Home View</Link>
  </div>
)

export default NotFoundView
