import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as GraveyardActions } from 'store/modules/graveyard'
import { actions as LabelsActions } from 'store/modules/labels'
import { actions as NotificationActions } from 'store/modules/notification'

export class DocumentsContextMenu extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    documents: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    items: PropTypes.string
  };

  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleOrderSwitch = this.handleOrderSwitch.bind(this)
    this.handleRemoveLabel = this.handleRemoveLabel.bind(this)
    this.handleUndoRemoveLabel = this.handleUndoRemoveLabel.bind(this)
    this.handleEmptyGraveyard = this.handleEmptyGraveyard.bind(this)
  }

  key (name) {
    return `menu-${name}`
  }

  get label () {
    const { labels } = this.props
    return labels.current
  }

  get refreshMenuItem () {
    return (
      <div key={this.key('refresh')} className='item' onClick={this.handleRefresh}>
        <i className='refresh icon'></i>
        Refresh
      </div>
    )
  }

  get orderMenuItem () {
    const { documents } = this.props
    const asc = documents.params && documents.params.order === 'asc'
    const txt = asc ? 'From most recent' : 'From oldest'
    const css = asc ? 'ascending' : 'descending'
    return (
      <div key={this.key('order')} className='item' onClick={this.handleOrderSwitch}>
        <i className={`sort numeric ${css}  icon`}></i>
        {txt}
      </div>
    )
  }

  get editLabelMenuItem () {
    const { location } = this.props
    if (this.label) {
      return (
        <Link key={this.key('edit-label')} to={{ pathname: `/label/${this.label.id}/edit`, state: {modal: true, returnTo: location, title: `Edit label: ${this.label.label}`} }}
          className='item'>
          <i className='tag icon'></i>
          Edit Label
        </Link>
      )
    }
  }

  get deleteLabelMenuItem () {
    if (this.label) {
      return (
        <a key={this.key('delete-label')} className='item' onClick={this.handleRemoveLabel}>
          <i className='trash icon'></i>
          Delete Label
        </a>
      )
    }
  }

  get emptyGraveyardMenuItem () {
    return (
      <a key={this.key('empty-graveyard')} className='item' onClick={this.handleEmptyGraveyard}>
        <i className='trash icon'></i>
        Empty the trash
      </a>
    )
  }

  get shareLabelMenuItem () {
    const { location } = this.props
    if (this.label) {
      return (
        <Link key={this.key('share-label')} to={{ pathname: `/label/${this.label.id}/share`, state: {modal: true, returnTo: location, title: `Share label: ${this.label.label}`} }}
          className='item'>
          <i className='share alternate icon'></i>
          Share Label
        </Link>
      )
    }
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

  handleRefresh () {
    const { actions, documents } = this.props
    const { params } = documents
    params.from = 0
    actions.documents.fetchDocuments(params)
  }

  handleOrderSwitch () {
    const { actions, documents } = this.props
    const { params } = documents
    params.order = params.order && params.order === 'asc' ? 'desc' : 'asc'
    params.from = 0
    actions.documents.fetchDocuments(params)
  }

  handleRemoveLabel () {
    const { actions } = this.props
    actions.labels.removeLabel(this.label)
    .then((label) => {
      actions.router.push({pathname: '/document'})
      actions.notification.showNotification({
        message: 'Label deleted',
        actionLabel: 'undo',
        actionFn: () => this.handleUndoRemoveLabel()
      })
    }).catch((err) => {
      actions.notification.showNotification({
        header: 'Unable to delete label',
        message: err.error,
        level: 'error'
      })
    })
  }

  handleUndoRemoveLabel () {
    const { actions } = this.props
    actions.labels.restoreRemovedLabel().then((label) => {
      actions.router.push({pathname: `/label/${label.id}`})
      actions.notification.showNotification({header: 'Label restored'})
    }).catch((err) => {
      actions.notification.showNotification({
        header: 'Unable to restore label',
        message: err.error,
        level: 'error'
      })
    })
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

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  documents: state.documents,
  labels: state.labels
})

const mapActionsToProps = (dispatch) => (bindActions({
  documents: DocumentsActions,
  graveyard: GraveyardActions,
  labels: LabelsActions,
  notification: NotificationActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentsContextMenu)
