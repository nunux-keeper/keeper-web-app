import React from 'react'

import AppSignPanel from 'components/AppSignPanel'

export const NotFoundView = (props) => (
  <div className='ui segment' style={{ height: '100%' }}>
    <AppSignPanel level='warn'>
      <i className='ban icon'></i>
      Page not found!
    </AppSignPanel>
  </div>
)
export default NotFoundView
