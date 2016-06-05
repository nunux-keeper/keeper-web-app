import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'

import { actions as documentsActions } from 'store/modules/documents'
import { actions as urlModalActions } from 'store/modules/urlModal'

import SearchBar from 'components/SearchBar'
import InfiniteGrid from 'components/InfiniteGrid'
import DocumentTile from 'components/DocumentTile'
import AppBar from 'components/AppBar'

import * as NProgress from 'nprogress'

import styles from './DocumentsView.scss'

export class DocumentsView extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    documents: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    fetchDocuments: PropTypes.func.isRequired,
    showUrlModal: PropTypes.func.isRequired
  };

  constructor () {
    super()
    this.fetchFollowingDocuments = this.fetchFollowingDocuments.bind(this)
    this.refreshDocuments = this.refreshDocuments.bind(this)
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
    const { location, showUrlModal } = this.props
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

    return (
      <AppBar title={this.title} styles={bg} contextMenu={this.contextMenu}>
        <div className='item'>
          <SearchBar />
        </div>
        <div className='ui dropdown icon right item'>
          <i className='plus vertical icon'></i>
          <div className='menu'>
            <Link to={createLink} className='item'>
              <i className='file outline icon'></i>New document...
            </Link>
            <a className='item' onClick={showUrlModal}>
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
        <div className='ui active centered inline loader' />
      )
    }
  }

  get documents () {
    const { isFetching, hasMore } = this.props.documents
    const items = this.props.documents.items.map((doc) => <DocumentTile key={'doc-' + doc.id} value={doc} />)
    const sizes = ['one', 'three', 'five']
    const size = sizes[this.props.device.size - 1]
    if (items.length) {
      return (
        <InfiniteGrid size={size} hasMore={hasMore} loadMore={this.fetchFollowingDocuments}>
          {items}
        </InfiniteGrid>
      )
    } else if (!isFetching) {
      return (
        <p className={styles.noDocuments}>No documents :(</p>
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
    const { params } = this.props.documents
    params.from++
    this.props.fetchDocuments(params)
  }

  refreshDocuments () {
    const { params } = this.props.documents
    params.from = 0
    this.props.fetchDocuments(params)
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  labels: state.labels,
  documents: state.documents,
  device: state.device
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, documentsActions, urlModalActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsView)
