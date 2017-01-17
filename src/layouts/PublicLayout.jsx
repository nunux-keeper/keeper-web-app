import React, { PropTypes } from 'react'

import './styles.css'

export default class PublicLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render () {
    const { children } = this.props

    return (
      <div id='PublicLayout'>
        <a href='/' title='Visite Nunux Keeper and manage your own documents'>
          <h1 className='ui inverted header'>
            <img src='/icons/icon-192x192.png' alt='logo' data-pin-nopin='true' />
            <div className='content'>
              Nunux Keeper<small>v2</small>
              <div className='sub header'>Your personal content curation service</div>
            </div>
          </h1>
        </a>
        <div className='main'>
          {children}
        </div>
      </div>
    )
  }
}

