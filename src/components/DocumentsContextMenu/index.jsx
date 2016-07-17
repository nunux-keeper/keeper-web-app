import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as LabelsActions } from 'store/modules/labels'
import { actions as NotificationActions } from 'store/modules/notification'

export class DocumentsContextMenu extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    documents: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleOrderSwitch = this.handleOrderSwitch.bind(this)
    this.handleRemoveLabel = this.handleRemoveLabel.bind(this)
    this.handleUndoRemoveLabel = this.handleUndoRemoveLabel.bind(this)
  }

  get label () {
    const { labels } = this.props
    return labels.current
  }

  get refreshMenuItem () {
    return (
      <div className='item' onClick={this.handleRefresh}>
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
      <div className='item' onClick={this.handleOrderSwitch}>
        <i className={`sort numeric ${css}  icon`}></i>
        {txt}
      </div>
    )
  }

  get editLabelMenuItem () {
    const { location } = this.props
    if (this.label) {
      return (
        <Link to={{ pathname: `/label/${this.label.id}/edit`, state: {modal: true, returnTo: location, title: `Edit label: ${this.label.label}`} }}
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
        <a className='item' onClick={this.handleRemoveLabel}>
          <i className='trash icon'></i>
          Delete Label
        </a>
      )
    }
  }

  get labelMenuDivider () {
    if (this.label) {
      return (<div className='ui divider'></div>)
    }
  }

  render () {
    return (
      <div className='menu'>
        {this.refreshMenuItem}
        {this.orderMenuItem}
        {this.labelMenuDivider}
        {this.editLabelMenuItem}
        {this.deleteLabelMenuItem}
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
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  documents: state.documents,
  labels: state.labels
})

const mapActionsToProps = (dispatch) => (bindActions({
  documents: DocumentsActions,
  labels: LabelsActions,
  notification: NotificationActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentsContextMenu)
