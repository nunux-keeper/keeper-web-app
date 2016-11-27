import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { bindActions } from 'store/helper'

import { actions as DocumentActions } from 'store/modules/document'
import { actions as GraveyardActions } from 'store/modules/graveyard'
import { actions as NotificationActions } from 'store/modules/notification'
import { actions as TitleModalActions } from 'store/modules/titleModal'

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
  }

  key (name) {
    const doc = this.props.doc
    return `menu-${name}-${doc.id}`
  }

  get detailMenuItem () {
    const { pathname } = this.props.location
    const doc = this.props.doc
    return (
      <Link
        key={this.key('detail')}
        to={{ pathname: `${pathname}/${doc.id}` }}
        title={doc.title}
        className='item'>
        <i className='zoom icon'></i>
        View
      </Link>
    )
  }

  get rawMenuItem () {
    const doc = this.props.doc
    const base = window.API_ROOT
    return (
      <a href={`${base}/document/${doc.id}?raw`}
        key={this.key('raw')}
        title='View RAW document'
        className='item'
        target='_blank'>
        <i className='file code outline icon'></i>
        View RAW
      </a>
    )
  }

  get editTitleMenuItem () {
    return (
      <div key={this.key('title')} className='item' onClick={this.handleEditTitle}>
        <i className='font icon'></i>
        Edit title
      </div>
    )
  }

  get editMenuItem () {
    const { actions } = this.props
    return (
      <div key={this.key('edit')} className='item' onClick={actions.document.toggleDocumentEditMode}>
        <i className='edit icon'></i>
        Edit mode
      </div>
    )
  }

  get shareMenuItem () {
    return (
      <div key={this.key('share')} className='item' >
        <i className='share alternate icon'></i>
        Share
      </div>
    )
  }

  get deleteMenuItem () {
    return (
      <div key={this.key('delete')} className='item' onClick={this.handleRemove}>
        <i className='trash icon'></i>
        Delete
      </div>
    )
  }

  get restoreMenuItem () {
    return (
      <div key={this.key('restore')} className='item' onClick={this.handleRestore}>
        <i className='history icon'></i>
        Restore
      </div>
    )
  }

  get destroyMenuItem () {
    return (
      <div key={this.key('destroy')} className='item' onClick={this.handleDestroy}>
        <i className='trash icon'></i>
        Remove forever
      </div>
    )
  }

  get dividerMenuItem () {
    return (<div key={this.key('divider' + Math.random())} className='ui divider'></div>)
  }

  get menu () {
    const { items } = this.props
    return items.split(',').map((item) => {
      return this[item + 'MenuItem']
    })
  }

  render () {
    return (
      <div className='menu'>
        {this.menu}
      </div>
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
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

const mapActionsToProps = (dispatch) => (bindActions({
  notification: NotificationActions,
  graveyard: GraveyardActions,
  document: DocumentActions,
  titleModal: TitleModalActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentContextMenu)
