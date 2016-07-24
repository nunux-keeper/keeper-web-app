import React from 'react'

import AppBar from 'components/AppBar'
import AppSignPanel from 'components/AppSignPanel'

export default class DocumentsView extends React.Component {
  render () {
    return (
      <div className='view'>
        <AppBar title='Shares' />
        <div className='ui main documents'>
          <AppSignPanel level='announcement'>
            <i className='rocket icon'></i>
            Upcoming feature...
          </AppSignPanel>
        </div>
      </div>
    )
  }
}

