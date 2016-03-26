import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'

import { actions as documentsActions } from 'redux/modules/documents'

// import InfiniteGrid from 'react-infinite-grid'
import SearchBar from 'components/SearchBar'
import InfiniteGrid from 'components/InfiniteGrid'
import DocumentTile from 'components/DocumentTile'
import AppBar from 'components/AppBar'

import styles from './DocumentsView.scss'

export class DocumentsView extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    documents: PropTypes.object.isRequired,
    label: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    fetchDocuments: PropTypes.func.isRequired
  };

  constructor () {
    super()
    this.fetchFollowingDocuments = this.fetchFollowingDocuments.bind(this)
  }

  get label () {
    const { label } = this.props
    return label.value
  }

  get title () {
    return this.label ? `Documents - ${this.label.label}` : 'Documents'
  }

  get contextMenu () {
    const { location } = this.props
    if (this.label) {
      return (
        <div className='menu'>
          <div className='item'>
            <i className='refresh icon'></i>
            Refresh
          </div>
          <div className='ui divider'></div>
          <Link to={{ pathname: `/label/${this.label.id}/edit`, state: {modal: true, returnTo: location.pathname, title: `Edit label: ${this.label.label}`} }}
            className='item'>
            <i className='tag icon'></i>
            Edit Label
          </Link>
        </div>
      )
    }
    return (
      <div className='menu'>
        <div className='item'>
          <i className='refresh icon'></i>
          Refresh
        </div>
      </div>
    )
  }

  get header () {
    const bg = this.label ? {backgroundColor: this.label.color} : {}

    return (
      <AppBar title={this.title} styles={bg} contextMenu={this.contextMenu}>
        <div className='item'>
          <SearchBar />
        </div>
      </AppBar>
    )
  }

  get spinner () {
    const { isFetching } = this.props.documents
    if (isFetching) {
      return (
        <div className='ui active dimmer'>
          <div className='ui large text loader'>Loading</div>
        </div>
      )
    }
  }

  get documents () {
    const { isFetching, hasMore } = this.props.documents
    const baseUrl = this.label ? `/label/${this.label.id}` : '/document'
    const items = this.props.documents.items.map((doc) => <DocumentTile key={'doc-' + doc.id} value={doc} baseUrl={baseUrl} />)
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
        <div className='ui main'>
          {this.spinner}
          {this.documents}
        </div>
      </div>
    )
  }

  fetchFollowingDocuments () {
    const { params } = this.props.documents
    params.from++
    this.props.fetchDocuments(params)
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  label: state.label,
  documents: state.documents,
  device: state.device
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, documentsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsView)
