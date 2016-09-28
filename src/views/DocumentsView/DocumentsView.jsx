import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { bindActions } from 'store/helper'

import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as UrlModalActions } from 'store/modules/urlModal'

import SearchBar from 'components/SearchBar'
import InfiniteGrid from 'components/InfiniteGrid'
import DocumentTile from 'components/DocumentTile'
import DocumentsContextMenu from 'components/DocumentsContextMenu'
import AppBar from 'components/AppBar'
import AppSignPanel from 'components/AppSignPanel'

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
  }

  componentDidUpdate (prevProps) {
    const {isProcessing} = this.props.documents
    const {isProcessing: wasProcessing} = prevProps.documents
    if (!wasProcessing && isProcessing) {
      NProgress.start()
    } else if (wasProcessing && !isProcessing) {
      NProgress.done()
    }
    document.title = this.title
  }

  get label () {
    const { labels } = this.props
    return labels.current
  }

  get title () {
    return this.label ? this.label.label : 'All documents'
  }

  get contextMenu () {
    const menuItems = this.label ? 'refresh,order,divider,editLabel,divider,deleteLabel' : 'refresh,order'
    return (<DocumentsContextMenu items={menuItems} />)
  }

  get header () {
    const { location, actions, documents: {total} } = this.props
    const bg = this.label ? {backgroundColor: this.label.color} : {}
    const createLink = {
      pathname: '/document/create',
      state: { modal: true, returnTo: location }
    }
    if (this.label) {
      createLink.query = {
        labels: [this.label.id]
      }
    }

    const $totalLabel = total ? <div className='ui tiny horizontal label'>{total}</div> : null
    const $title = <div>{$totalLabel}<span>{this.title}</span></div>

    return (
      <AppBar title={$title} styles={bg} contextMenu={this.contextMenu}>
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
    const { isFetching, items, hasMore, error } = this.props.documents
    if (error) {
      return (
        <AppSignPanel level='error'>
          <i className='bug icon'></i>
          An error occurred!
        </AppSignPanel>
      )
    } else if (!isFetching && items.length === 0) {
      return (
        <AppSignPanel>
          <i className='ban icon'></i>
          No documents.
        </AppSignPanel>
      )
    } else {
      const $items = items.map((doc) => <DocumentTile key={'doc-' + doc.id} value={doc} />)
      const sizes = ['one', 'three', 'five']
      const size = sizes[this.props.device.size - 1]
      return (
        <InfiniteGrid size={size} hasMore={hasMore} loadMore={this.fetchFollowingDocuments}>
          {$items}
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
    params.from += params.size
    actions.documents.fetchDocuments(params)
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
  urlModal: UrlModalActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentsView)
