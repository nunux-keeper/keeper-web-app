import React from 'react'
// import { Link } from 'react-router'

import './HomeView.scss'

export const HomeView = (props) => (
  <div id='homepage'>
    <div className='ui large top fixed hidden menu'>
      <div className='ui container'>
        <a className='active item'>Intro</a>
        <a className='item'>Features</a>
        <a className='item'><i className='github icon'></i> Github</a>
      </div>
    </div>

    <div className='ui vertical inverted sidebar menu'>
      <a className='active item' href='#homepage'>Intro</a>
      <a className='item' href='#features'>Features</a>
      <a className='item' href='https://github.com/ncarlier/nunux-keeper' target='_blank'><i className='github icon'></i>Github</a>
    </div>

    <div className='pusher'>
      <div className='ui inverted vertical masthead center aligned segment'>
        <div className='ui container'>
          <div className='ui large secondary inverted pointing menu'>
            <a className='toc item'>
              <i className='sidebar icon'></i>
            </a>
            <a className='active item' href='#homepage'>Intro</a>
            <a className='item' href='#features'>Features</a>
            <a className='item' href='https://github.com/ncarlier/nunux-keeper' target='_blank'><i className='github icon'></i>Github</a>
          </div>
        </div>

        <div className='ui text container'>
          <h1 className='ui inverted header'>
            <img src='/icons/icon-192x192.png' />
            <div className='content'>
              Nunux Keeper<small>v2</small>
              <div className='sub header'>Your personal content curation service</div>
            </div>
          </h1>
          <a className='ui huge primary button' href='/document'>
            View my documents <i className='right arrow icon'></i>
          </a>
        </div>

      </div>

      <div className='ui stackable two column grid container' id='features'>
        <div className='column'>
          <h2 className='ui header'>Archive, Classify and Search</h2>
          <div className='description'>
            <p>
              View, edit, classify and archive many kind of internet documents in your
              own personal storage.<br/>
              Classify your documents and retrieve them thanks to a powerful search engine.
            </p>
          </div>
        </div>
        <div className='column'>
          <img src='/images/feat/search.png' />
        </div>
        <div className='column'>
          <h2 className='ui header'>Progressive Web App</h2>
          <div className='description'>
            <p>
              Use the same web app on desktop or mobile with the same and complete
              user experience.
            </p>
          </div>
        </div>
        <div className='column'>
          <img src='/images/feat/mobile.png' />
        </div>
        <div className='column'>
          <h2 className='ui header'>Bookmarklet</h2>
          <div className='description'>
            <p>
              Add "Keep it" button to your navigation bar and archive any web content you
              are interested in while you are surfing.
            </p>
          </div>
        </div>
        <div className='column'>
          <img src='/images/feat/bookmarklet.png' />
        </div>
        <div className='column'>
          <h2 className='ui header'>Command line for nerds</h2>
          <div className='description'>
            <p>
              Manage your documents from your terminal (Linux, OSX and even Windows) thanks
              to the <a href='https://github.com/ncarlier/keeper-cli' target='_blank'>CLI</a>.
            </p>
          </div>
        </div>
        <div className='column'>
          <img src='/images/feat/cli.png' />
        </div>
        <div className='column'>
          <h2 className='ui header'>Easy to integrate with other tools and services</h2>
          <div className='description'>
            <p>
              Nunux Keeper can be easily be integrated with many other services thanks to its true open&nbsp;
              <a href='https://api.nunux.org/keeper/api-docs/?url=https://api.nunux.org/keeper/api-docs.json' target='_blank'>API</a> or&nbsp;
              <a href='https://github.com/ncarlier/node-keeper' target='_blank'>client library</a> or&nbsp;
              <a href='https://github.com/ncarlier/node-red-contrib-keeper' target='_blank'>NodeRed plugin</a>.
            </p>
          </div>
        </div>
        <div className='column'>
          <img src='/images/feat/nodered.png' />
        </div>
      </div>

      <div className='ui inverted vertical footer segment'>
        <div className='ui container'>
          <div className='ui stackable inverted divided equal height stackable grid'>
            <div className='three wide column'>
              <h4 className='ui inverted header'>About</h4>
              <div className='ui inverted link list'>
                <a href='https://github.com/ncarlier/nunux-keeper' className='item'>Sources</a>
                <a href='https://api.nunux.org/keeper/api-docs/?url=https://api.nunux.org/keeper/api-docs.json' className='item'>Documentation</a>
                <a href='http://ncarlier.github.io/' className='item'>Author</a>
                <a href='https://flattr.com/submit/auto?user_id=ncarlier&amp;url=http%3A%2F%2Fkeeper.nunux.org%2F' className='item' target='_blank'>
                  Support this project!
                </a>
              </div>
            </div>
            <div className='three wide column'>
              <h4 className='ui inverted header'>Other services</h4>
              <div className='ui inverted link list'>
                <a href='https://reader.nunux.org' className='item'>Nunux Reader</a>
                <a href='https://github.com/ncarlier/nunux-keeper' className='item'>Nunux Keeper V1</a>
              </div>
            </div>
            <div className='seven wide column'>
              <h4 className='ui inverted header'>License</h4>
              <p>
                This program is free software; you can redistribute it and/or modify
                it under the terms of the GNU General Public License as published by
                the Free Software Foundation; either version 3 of the License, or
                (at your option) any later version.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default HomeView
