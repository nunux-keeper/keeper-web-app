import React from 'react'
import { Link } from 'react-router'

export const HomeView = (props) => (
  <div id='welcome' className='ui panel announcement'>
    <div className='content'>
      <div className='center'>
        <h2 className='ui icon header'>
          <img src='https://keeper.nunux.org/icons/icon_152.png' className='ui image' />
          <div className='content'>
            Nunux Keeper v2
            <div className='sub header'>
              Your personal content curation service
            </div>
          </div>
        </h2>
        <br/>
        <Link to='/document' className='positive ui button'>
          View my documents
        </Link>
      </div>
    </div>
  </div>
)

export default HomeView
