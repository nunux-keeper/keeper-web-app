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

  get isLabelsRoute () {
    return /^\/labels\//.test(this.props.location.pathname)
  }

  get isSharingRoute () {
    return /^\/sharing\//.test(this.props.location.pathname)
  }

  get label () {
    const { label } = this.props
    return label.current ? label.current : {label: 'Undefined'}
  }

  get title () {
    switch (true) {
      case this.isLabelsRoute:
        return this.label.label
      case this.isSharingRoute:
        return 'Sharing'
      default:
        return 'All documents'
    }
  }

  get contextMenuItems () {
    return this.isLabelsRoute
      ? 'refresh,order,divider,editLabel,shareLabel,divider,deleteLabel'
      : 'refresh,order'
  }

  get contextMenuItem () {
    return this.isSharingRoute
      ? 'detail'
      : 'detail,share,divider,editTitle,divider,delete'
  }

  get headerStyle () {
    switch (true) {
      case this.isLabelsRoute:
        return {backgroundColor: this.label.color}
      case this.isSharingRoute:
        return {backgroundColor: '#1678c2'}
      default:
        return {}
    }
  }

  get headerIcon () {
    switch (true) {
      case this.isLabelsRoute:
        return 'tag'
      case this.isSharingRoute:
        return 'share alternate'
      default:
        return 'grid layout'
    }
  }

  get headerCreateButton () {
    if (this.isSharingRoute) {
      return null
    }
    const { location, actions } = this.props
    const createLink = {
      pathname: '/documents/create',
      state: { modal: true, returnTo: location }
    }
    if (this.isLabelsRoute) {
      createLink.query = {
        labels: [this.label.id]
      }
    }

    return (
      <Menu.Item as={Dropdown} className='right hack plus'>
        <Dropdown.Menu>
          <Dropdown.Header content='New document' />
          <Dropdown.Divider />
          <Dropdown.Item as={Link} icon='write' text='From skratch' to={createLink}/>
          <Dropdown.Item icon='linkify' text='From URL' onClick={actions.urlModal.showUrlModal} />
        </Dropdown.Menu>
      </Menu.Item>
    )
  }

  get header () {
    const { documents: {total} } = this.props
    const $totalLabel = total ? <small>[{total}]</small> : null
    const $title = <span><Icon name={this.headerIcon} />{this.title} {$totalLabel}</span>

    return (
      <AppBar title={$title} styles={this.headerStyle} hideTitleOnMobile >
        <Menu.Menu className='right'>
          <SearchBarItem placeholder={`Search in "${this.title}"...`} />
          {this.headerCreateButton}
          <Menu.Item as={Dropdown} className='right hack ellipsis-v'>
            <DocumentsContextMenu items={this.contextMenuItems} />
          </Menu.Item>
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
          {error.error || 'An error occurred!'}
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
      const $items = items.map((doc) => <DocumentTile key={'doc-' + doc.id} value={doc} menu={this.contextMenuItem}/>)
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
