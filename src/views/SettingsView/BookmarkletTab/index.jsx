import React from 'react'

import './styles.css'

import { Message, Icon } from 'semantic-ui-react'

export default class BookmarkletTab extends React.Component {

  handleClick () {
    alert('Don\'t click on me! But drag and drop me to your toolbar.')
  }

  render () {
    const { origin } = document.location
    return (
      <div>
        <Message icon>
          <Icon name='help' />
          <Message.Content>
            <Message.Header>
              What is a bookmarklet?
            </Message.Header>
            <p>
              A small software application stored as a bookmark in a web browser,
              which typically allows a user to interact with the currently loaded web page in some way:
              In our case save the page as a document.
            </p>
          </Message.Content>
        </Message>
        <h4>Drag and drop the link bellow in your toolbar:</h4>
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

