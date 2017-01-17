import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Dropdown, Menu, Dimmer, Loader, Icon } from 'semantic-ui-react'

import { bindActions } from 'store/helper'

import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as GraveyardActions } from 'store/modules/graveyard'
import { actions as UrlModalActions } from 'store/modules/urlModal'
import { actions as NotificationActions } from 'store/modules/notification'

import SearchBarItem from 'components/SearchBarItem'
import InfiniteGrid from 'components/InfiniteGrid'
import DocumentTile from 'components/DocumentTile'
import DocumentsContextMenu from 'components/DocumentsContextMenu'
import AppBar from 'components/AppBar'
import AppSignPanel from 'components/AppSignPanel'

import * as NProgress from 'nprogress'

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  label: state.label,
  documents: state.documents,
  graveyard: state.graveyard,
  layout: state.layout
})

const mapActionsToProps = (dispatch) => (bindActions({
  documents: DocumentsActions,
  graveyard: GraveyardActions,
  urlModal: UrlModalActions,
  notification: NotificationActions
}, dispatch))

export class DocumentsView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    documents: PropTypes.object.isRequired,
    graveyard: PropTypes.object.isRequired,
    label: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired
  };

  static connect (component) {
    return connect(mapStateToProps, mapActionsToProps)(component)
  }

  constructor () {
    super()
    this.title = 'All documents'
    this.contextMenuItems = 'refresh,order'
    this.tileContextMenuItems = 'detail,share,divider,editTitle,divider,delete'
    this.headerStyle = {}
    this.headerIcon = 'grid layout'
    this.fetchFollowingDocuments = this.fetchFollowingDocuments.bind(this)
    this.pub = false
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

  get createDocumentLink () {
    const { location } = this.props
    return {
      pathname: '/documents/create',
      state: { modal: true, returnTo: location }
    }
  }

  get headerAltButton () {
    const { actions } = this.props
    return (
      <Menu.Item as={Dropdown} className='right hack plus' title='Add new document'>
        <Dropdown.Menu>
          <Dropdown.Header content='New document' />
          <Dropdown.Divider />
          <Dropdown.Item as={Link} icon='write' text='From skratch' to={this.createDocumentLink}/>
          <Dropdown.Item icon='linkify' text='From URL' onClick={actions.urlModal.showUrlModal} />
        </Dropdown.Menu>
      </Menu.Item>
    )
  }

  get header () {
    const { total } = this.data
    const $totalLabel = total ? <small>[{total}]</small> : null
    const $title = <span><Icon name={this.headerIcon} />{this.title} {$totalLabel}</span>

    return (
      <AppBar title={$title} styles={this.headerStyle} hideTitleOnMobile >
        <Menu.Menu className='right'>
          <SearchBarItem placeholder={`Search in "${this.title}"...`} />
          {this.headerAltButton}
          <Menu.Item as={Dropdown} className='right hack ellipsis-v'>
            <DocumentsContextMenu items={this.contextMenuItems} />
          </Menu.Item>
        </Menu.Menu>
      </AppBar>
    )
  }

  get noContent () {
    return (
      <AppSignPanel>
        <Icon name='ban' />
        No documents.
      </AppSignPanel>
      )
  }

  get data () {
    return this.props.documents
  }

  get documents () {
    const { isFetching, items, hasMore, error } = this.data
    if (error) {
      return (
        <AppSignPanel level='error'>
          <Icon name='bug' />
          {error.error || 'An error occurred!'}
        </AppSignPanel>
      )
    } else if (!isFetching && items.length === 0) {
      return this.noContent
    } else {
      const $items = items.map((doc) => this.getDocumentTile(doc))
      const sizes = ['one', 'three', 'five']
      const size = sizes[this.props.layout.size - 1]
      return (
        <InfiniteGrid size={size} hasMore={hasMore} loadMore={this.fetchFollowingDocuments}>
          {$items}
        </InfiniteGrid>
      )
    }
  }

  getDocumentTile (doc) {
    const { params } = this.data
    const { location } = this.props
    return (
      <DocumentTile
        key={'doc-' + doc.id}
        value={doc}
        menu={this.tileContextMenuItems}
        base={location}
        sharing={params.sharingId}
        pub={this.pub}
      />
    )
  }

  render () {
    const { isFetching } = this.data
    return (
      <div className='view'>
        {this.header}
        <Dimmer.Dimmable dimmed={isFetching} className='viewContent documents' >
          <Dimmer active={isFetching} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
          {this.documents}
        </Dimmer.Dimmable>
      </div>
    )
  }

  fetchFollowingDocuments () {
    const { actions, documents: { params } } = this.props
    params.from += params.size
    return actions.documents.fetchDocuments(params)
  }
}

export default DocumentsView.connect(DocumentsView)
