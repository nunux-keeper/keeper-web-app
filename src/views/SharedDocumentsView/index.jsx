import React from 'react'

import { Icon } from 'semantic-ui-react'

import { DocumentsView } from 'views/DocumentsView'
import AppSignPanel from 'components/AppSignPanel'

export class SharedDocumentsView extends DocumentsView {

  constructor () {
    super()
    this.title = 'Sharing'
    this.tileContextMenuItems = 'detail'
    this.headerStyle = {backgroundColor: '#1678c2'}
    this.headerIcon = 'share alternate'
  }

  get headerAltButton () {
    return null
  }

  get noContent () {
    return (
      <AppSignPanel>
        <Icon name='ban' />
        No shared documents
      </AppSignPanel>
    )
  }
}

export default DocumentsView.connect(SharedDocumentsView)
