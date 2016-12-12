import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Dropdown, Menu, Dimmer, Loader, Icon } from 'semantic-ui-react'

import { bindActions } from 'store/helper'

import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as UrlModalActions } from 'store/modules/urlModal'
import { actions as NotificationActions } from 'store/modules/notification'

import SearchBarItem from 'components/SearchBarItem'
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
    label: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired
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
    const { label } = this.props
    return label.current
  }

  get title () {
    return this.label ? this.label.label : 'All documents'
  }

  get contextMenuItems () {
    return this.label ? 'refresh,order,divider,editLabel,shareLabel,divider,deleteLabel' : 'refresh,order'
  }

  get header () {
    const { location, actions, documents: {total} } = this.props
    const bg = this.label ? {backgroundColor: this.label.color} : {}
    const createLink = {
      pathname: '/document/create',
      state: { modal: true, returnTo: location }
    }
    var icon = 'grid layout'
    if (this.label) {
      icon = 'tag'
      createLink.query = {
        labels: [this.label.id]
      }
    }

    const $totalLabel = total ? <small>[{total}]</small> : null
    const $title = <span><Icon name={icon} />{this.title} {$totalLabel}</span>

    return (
      <AppBar title={$title} styles={bg} >
        <Menu.Menu className='right'>
          <SearchBarItem placeholder={`Search in "${this.title}"...`} />
          <Dropdown as={Menu.Item} icon='plus' simple className='right'>
            <Dropdown.Menu>
              <Dropdown.Header content='New document' />
              <Dropdown.Divider />
              <Dropdown.Item as={Link} icon='write' text='From skratch' to={createLink}/>
              <Dropdown.Item icon='linkify' text='From URL' onClick={actions.urlModal.showUrlModal} />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown as={Menu.Item} icon='ellipsis vertical' simple className='right'>
            <DocumentsContextMenu items={this.contextMenuItems} />
          </Dropdown>
        </Menu.Menu>
      </AppBar>
    )
  }

  get documents () {
    const { isFetching, items, hasMore, error } = this.props.documents
    if (error) {
      return (
        <AppSignPanel level='error'>
          <Icon name='bug' />
          An error occurred!
        </AppSignPanel>
      )
    } else if (!isFetching && items.length === 0) {
      return (
        <AppSignPanel>
          <Icon name='ban' />
          No documents.
        </AppSignPanel>
      )
    } else {
      const $items = items.map((doc) => <DocumentTile key={'doc-' + doc.id} value={doc} />)
      const sizes = ['one', 'three', 'five']
      const size = sizes[this.props.layout.size - 1]
      return (
        <InfiniteGrid size={size} hasMore={hasMore} loadMore={this.fetchFollowingDocuments}>
          {$items}
        </InfiniteGrid>
      )
    }
  }

  render () {
    const { isFetching } = this.props.documents
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
    const { actions, documents } = this.props
    const { params } = documents
    params.from += params.size
    return actions.documents.fetchDocuments(params)
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  label: state.label,
  documents: state.documents,
  layout: state.layout
})

const mapActionsToProps = (dispatch) => (bindActions({
  documents: DocumentsActions,
  urlModal: UrlModalActions,
  notification: NotificationActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentsView)
