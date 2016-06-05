import React from 'react'
import { Link } from 'react-router'

export const HomeView = (props) => (
  <div>
    <h1>Welcome to Nunux Keeper</h1>
    <hr />
    <Link to='/document'>View my documents</Link>
  </div>
)

export default HomeView
