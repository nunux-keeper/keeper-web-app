import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as LabelsActions } from 'store/modules/labels'
import { actions as UrlModalActions } from 'store/modules/urlModal'
import { actions as NotificationActions } from 'store/modules/notification'

import SearchBar from 'components/SearchBar'
import InfiniteGrid from 'components/InfiniteGrid'
import DocumentTile from 'components/DocumentTile'
import AppBar from 'components/AppBar'

import * as NProgress from 'nprogress'

export class DocumentsView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    documents: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired
  };

  constructor () {
    super()
    this.fetchFollowingDocuments = this.fetchFollowingDocuments.bind(this)
    this.refreshDocuments = this.refreshDocuments.bind(this)
    this.removeLabel = this.removeLabel.bind(this)
    this.undoRemoveLabel = this.undoRemoveLabel.bind(this)
  }

  componentDidUpdate (prevProps) {
    const {isProcessing} = this.props.documents
    const {isProcessing: wasProcessing} = prevProps.documents
    if (!wasProcessing && isProcessing) {
      NProgress.start()
    } else if (wasProcessing && !isProcessing) {
      NProgress.done()
    }
  }

  get label () {
    const { labels } = this.props
    return labels.current
  }

  get title () {
    const { total } = this.props.documents
    const title = this.label ? `Documents - ${this.label.label}` : 'Documents'
    const totalLabel = total ? <div className='ui tiny horizontal label'>{total}</div> : null
    return (
      <div>
        {totalLabel}
        <span>{title}</span>
      </div>
    )
  }

  get contextMenu () {
    const { location } = this.props
    if (this.label) {
      return (
        <div className='menu'>
          <a className='item' onClick={this.refreshDocuments}>
            <i className='refresh icon'></i>
            Refresh
          </a>
          <div className='ui divider'></div>
          <Link to={{ pathname: `/label/${this.label.id}/edit`, state: {modal: true, returnTo: location, title: `Edit label: ${this.label.label}`} }}
            className='item'>
            <i className='tag icon'></i>
            Edit Label
          </Link>
          <a className='item' onClick={this.removeLabel}>
            <i className='trash icon'></i>
            Delete Label
          </a>
        </div>
      )
    }
    return (
      <div className='menu'>
        <a className='item' onClick={this.refreshDocuments}>
          <i className='refresh icon'></i>
          Refresh
        </a>
      </div>
    )
  }

  get header () {
    const { location, actions } = this.props
    const bg = this.label ? {backgroundColor: this.label.color} : {}
    const title = this.label ? this.label.label : 'All documents'
    const createLink = {
      pathname: '/document/create',
      state: { modal: true, returnTo: location }
    }
    if (this.label) {
      createLink.query = {
        labels: [this.label.id]
      }
    }

    return (
      <AppBar title={title} styles={bg} contextMenu={this.contextMenu}>
        <div className='item'>
          <SearchBar />
        </div>
        <div className='ui dropdown icon right item'>
          <i className='plus vertical icon'></i>
          <div className='menu'>
            <Link to={createLink} className='item'>
              <i className='file outline icon'></i>New document...
            </Link>
            <a className='item' onClick={actions.urlModal.showUrlModal}>
              <i className='cloud download icon'></i>From URL...
            </a>
          </div>
        </div>
      </AppBar>
    )
  }

  get loader () {
    const { isFetching } = this.props.documents
    if (isFetching) {
      return (
        <div className='ui active inverted dimmer'>
          <div className='ui indeterminate text loader'>Loading Documents</div>
        </div>
      )
    }
  }

  get documents () {
    const { isFetching, hasMore, error } = this.props.documents
    const items = this.props.documents.items.map((doc) => <DocumentTile key={'doc-' + doc.id} value={doc} />)
    const sizes = ['one', 'three', 'five']
    const size = sizes[this.props.device.size - 1]
    if (error) {
      return (
        <div className='ui error panel'>
          <div className='content'>
            <div className='center'>
              <h2 className='ui icon inverted header'>
                <i className='bug icon'></i>
                An error occurred!
              </h2>
            </div>
          </div>
        </div>
      )
    } else if (!isFetching && items.length === 0) {
      return (
        <div className='ui panel'>
          <div className='content'>
            <div className='center'>
              <h2 className='ui icon header gray'>
                <i className='ban icon'></i>
                No documents.
              </h2>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <InfiniteGrid size={size} hasMore={hasMore} loadMore={this.fetchFollowingDocuments}>
          {items}
        </InfiniteGrid>
      )
    }
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='ui main documents'>
          {this.documents}
          {this.loader}
        </div>
      </div>
    )
  }

  fetchFollowingDocuments () {
    const { actions, documents } = this.props
    const { params } = documents
    params.from++
    actions.documents.fetchDocuments(params)
  }

  refreshDocuments () {
    const { actions, documents } = this.props
    const { params } = documents
    params.from = 0
    actions.documents.fetchDocuments(params)
  }

  removeLabel () {
    const { actions } = this.props
    actions.labels.removeLabel(this.label)
    .then((label) => {
      actions.router.push({pathname: '/document'})
      actions.notification.showNotification({
        message: 'Label deleted',
        actionLabel: 'undo',
        actionFn: () => this.undoRemoveLabel()
      })
    }).catch((err) => {
      actions.notification.showNotification({
        header: 'Unable to delete label',
        message: err.error,
        level: 'error'
      })
    })
  }

  undoRemoveLabel () {
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
  labels: state.labels,
  documents: state.documents,
  device: state.device
})

const mapActionsToProps = (dispatch) => (bindActions({
  documents: DocumentsActions,
  labels: LabelsActions,
  urlModal: UrlModalActions,
  notification: NotificationActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentsView)
