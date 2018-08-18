import React from 'react'

import AppBar from 'components/AppBar'

export default class AboutView extends React.Component {
  componentDidMount () {
    document.title = 'About'
  }

  get header () {
    const $title = <span><i className='question circle outline icon'></i>About</span>
    return (
      <AppBar title={$title} />
    )
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='viewContent'>
          <div className='ui basic segment' style={{textAlign: 'center'}}>
            <h2 className='ui icon center aligned header'>
              <img src='./logo.svg' className='ui icon' role='presentation' />
              Nunux Keeper
              <div className='sub header'>Your personal content curation service</div>
            </h2>
            <div role='list' className='ui bulleted horizontal link list'>
              <a role='listitem' className='item' href='https://github.com/nunux-keeper' target='_blank'>
                Sources
              </a>
              <a role='listitem' className='item' href='https://github.com/nunux-keeper/keeper-web-app/issues' target='_blank'>
                Bug or feature request
              </a>
              <a role='listitem' className='item' href='https://keeper.nunux.org/blog/' target='_blank'>
                Blog
              </a>
              <a role='listitem' className='item' href='https://www.paypal.me/nunux' target='_blank'>
                Support this project
              </a>
            </div>
          </div>
        </div>
      </div>
      )
  }
}

