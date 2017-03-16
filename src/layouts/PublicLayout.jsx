import React, { PropTypes } from 'react'

import './styles.css'

const basename = process.env.PUBLIC_URL || ''

export default class PublicLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  };

  render () {
    const { children } = this.props

    return (
      <div id='PublicLayout'>
        <a href={`${basename}/`} title='Visite Nunux Keeper and manage your own documents'>
          <h1 className='ui inverted header'>
            <img src={`${basename}/logo.svg`} alt='logo' data-pin-nopin='true' height='80' width='80' />
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

