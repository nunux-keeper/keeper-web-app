import React from 'react'

import './styles.css'

export default class BookmarkletTab extends React.Component {

  handleClick () {
    alert('Don\'t click on me! But drag and drop me to your toolbar.')
  }

  render () {
    const { origin } = document.location
    return (
      <div>
        <p>Create document outside the app.</p>
        <p>Drag and drop the link bellow in your toolbar.</p>
        <a href={`javascript:(function(){K_REALM="${origin}";K_SCR=document.createElement("SCRIPT");
          K_SCR.type="text/javascript";K_SCR.src=K_REALM+"/bookmarklet.js";
          document.getElementsByTagName("head")[0].appendChild(K_SCR)})();`}
          onClick={this.handleClick}
          title='Drag me in your toolbar!'
          className='bookmarklet-link'>
          Keep This!
        </a>
      </div>
    )
  }
}

