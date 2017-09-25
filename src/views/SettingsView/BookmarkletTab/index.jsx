import React from 'react'

import './styles.css'

import { Header, Divider, Segment } from 'semantic-ui-react'

export default class BookmarkletTab extends React.Component {

  handleClick () {
    alert('Don\'t click on me! But drag and drop me to your toolbar.')
  }

  render () {
    const { origin } = document.location
    return (
      <div>
        <Header size='small'>The bookmarklet</Header>
        <Divider />
        <p>
          A bookmarklet is a small software application stored as a bookmark in a web browser,
          which typically allows a user to interact with the currently loaded web page in some way:
          In our case save the page as a document.
        </p>
        <Segment>
          Drag and drop the link bellow in your toolbar:&nbsp;
          <a href={`javascript:(function(){K_REALM="${origin}";K_SCR=document.createElement("SCRIPT");
            K_SCR.type="text/javascript";K_SCR.src=K_REALM+"/bookmarklet.js";
            document.getElementsByTagName("head")[0].appendChild(K_SCR)})();`}
            onClick={this.handleClick}
            title='Drag me in your toolbar!'
            className='bookmarklet-link'>
            Keep This!
          </a>
        </Segment>
      </div>
    )
  }
}

