import React from 'react'

import { Menu, Icon } from 'semantic-ui-react'

import { DocumentsView } from 'views/DocumentsView'
import AppSignPanel from 'components/AppSignPanel'

export class GraveyardView extends DocumentsView {
  constructor () {
    super()
    this.title = 'Trash'
    this.headerStyle = {backgroundColor: '#696969'}
    this.headerIcon = 'trash'
    this.handleEmptyGraveyard = this.handleEmptyGraveyard.bind(this)
  }

  get headerAltButton () {
    return <Menu.Item as='a' icon='trash' onClick={this.handleEmptyGraveyard} title='Empty the trash' />
  }

  get noContent () {
    return (
      <AppSignPanel>
        <Icon name='trash' />
        The trash is empty
      </AppSignPanel>
    )
  }

  get data () {
    return this.props.graveyard
  }

  fetchFollowingDocuments () {
    const { actions, graveyard: { params } } = this.props
    params.from += params.size
    return actions.graveyard.fetchGhosts(params)
  }

  handleEmptyGraveyard () {
    const { actions } = this.props
    actions.graveyard.emptyGraveyard().then(() => {
      actions.notification.showNotification({header: 'The trash is emptied'})
    }).catch((err) => {
      actions.notification.showNotification({
        header: 'Unable to empty the trash',
        message: err.error,
        level: 'error'
      })
    })
  }
}

export default DocumentsView.connect(GraveyardView)

