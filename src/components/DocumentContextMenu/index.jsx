import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Dropdown } from 'semantic-ui-react'

import { bindActions } from 'store/helper'

import { actions as DocumentActions } from 'store/modules/document'
import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as GraveyardActions } from 'store/modules/graveyard'
import { actions as NotificationActions } from 'store/modules/notification'
import { actions as TitleModalActions } from 'store/modules/titleModal'

const API_ROOT = process.env.REACT_APP_API_ROOT

export class DocumentContextMenu extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    doc: PropTypes.object.isRequired,
    items: PropTypes.string,
    direction: PropTypes.string
  };

  static defaultProps = {
    direction: 'right'
  };

  constructor (props) {
    super(props)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleRestore = this.handleRestore.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUndoRemove = this.handleUndoRemove.bind(this)
    this.handleEditTitle = this.handleEditTitle.bind(this)
    this.handleEditTileLabels = this.handleEditTileLabels.bind(this)
  }

  key (name) {
    const doc = this.props.doc
    return `menu-${name}-${doc.id}`
  }

  get detailMenuItem () {
    const { pathname } = this.props.location
    const doc = this.props.doc
    return (
      <Dropdown.Item
        icon='zoom'
        as={Link}
        key={this.key('detail')}
        to={{ pathname: `${pathname}/${doc.id}` }}
        title={doc.title}
        text='View' />
    )
  }

  get rawMenuItem () {
    const doc = this.props.doc
    return (
      <Dropdown.Item
        icon='file code outline'
        as='a'
        key={this.key('raw')}
        href={`${API_ROOT}/documents/${doc.id}?raw`}
        title='View RAW document'
        target='_blank'
        text='View RAW' />
    )
  }

  get editTitleMenuItem () {
    return (
      <Dropdown.Item
        icon='font'
        as='div'
        key={this.key('title')}
        onClick={this.handleEditTitle}
        text='Edit title' />
    )
  }

  get editMenuItem () {
    const { actions } = this.props
    return (
      <Dropdown.Item
        icon='edit'
        as='div'
        key={this.key('edit')}
        onClick={actions.document.toggleDocumentEditMode}
        text='Edit mode' />
    )
  }

  get editTileLabelsMenuItem () {
    return (
      <Dropdown.Item
        icon='edit'
        as='div'
        key={this.key('edit')}
        onClick={this.handleEditTileLabels}
        text='Edit labels' />
    )
  }

  get deleteMenuItem () {
    return (
      <Dropdown.Item
        icon='trash'
        as='div'
        key={this.key('delete')}
        onClick={this.handleRemove}
        text='Delete' />
    )
  }

  get restoreMenuItem () {
    return (
      <Dropdown.Item
        icon='history'
        as='div'
        key={this.key('restore')}
        onClick={this.handleRestore}
        text='Restore' />
    )
  }

  get destroyMenuItem () {
    return (
      <Dropdown.Item
        icon='trash'
        as='div'
        key={this.key('destroy')}
        onClick={this.handleDestroy}
        text='Remove forever' />
    )
  }

  get dividerMenuItem () {
    return (<Dropdown.Divider key={this.key('divider' + Math.random())} />)
  }

  get menu () {
    const { items } = this.props
    return items.split(',').map((item) => {
      return this[item + 'MenuItem']
    })
  }

  render () {
    return (
      <Dropdown.Menu>
        {this.menu}
      </Dropdown.Menu>
    )
  }

  handleUndoRemove () {
    const { actions } = this.props
    actions.document.restoreRemovedDocument().then(() => {
      actions.notification.showNotification({
        level: 'info',
        header: 'Document restored'
      })
    })
  }

  handleRemove () {
    const {doc, actions} = this.props
    actions.document.removeDocument(doc).then(() => {
      actions.notification.showNotification({
        level: 'info',
        header: 'Document moved to trash',
        actionLabel: 'undo',
        actionFn: () => this.handleUndoRemove()
      })
    })
  }

  handleRestore () {
    const { doc, actions } = this.props
    actions.document.restoreDocument(doc).then(() => {
      actions.notification.showNotification({
        level: 'info',
        header: 'Document restored from trash'
      })
    })
  }

  handleDestroy () {
    const { doc, actions } = this.props
    actions.graveyard.removeGhost(doc).then(() => {
      actions.notification.showNotification({
        level: 'info',
        header: 'Document completely removed'
      })
    })
  }

  handleEditTitle () {
    const { doc, actions } = this.props
    actions.titleModal.showTitleModal(doc)
  }

  handleEditTileLabels () {
    const { doc, actions } = this.props
    actions.documents.toggleDocumentLabelsEditMode(doc)
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

const mapActionsToProps = (dispatch) => (bindActions({
  notification: NotificationActions,
  graveyard: GraveyardActions,
  document: DocumentActions,
  documents: DocumentsActions,
  titleModal: TitleModalActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentContextMenu)
