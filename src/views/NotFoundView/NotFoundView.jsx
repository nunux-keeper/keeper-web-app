import React from 'react'
import { Link } from 'react-router'

export const NotFoundView = (props) => (
  <div className='ui segment' style={{ height: '100%' }}>
    <div className='ui active dimmer warn'>
      <div className='content'>
        <div className='center'>
          <h2 className='ui inverted icon header'>
            <i className='ban icon'></i>
            Page not found!
          </h2>
          <br/>
          <Link to='/'>Back to home page</Link>
        </div>
      </div>
    </div>
  </div>
)
export default NotFoundView
