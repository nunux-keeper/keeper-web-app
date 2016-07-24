import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'

import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as GraveyardActions } from 'store/modules/graveyard'
import { actions as UrlModalActions } from 'store/modules/urlModal'

import SearchBar from 'components/SearchBar'
import InfiniteGrid from 'components/InfiniteGrid'
import DocumentTile from 'components/DocumentTile'
import DocumentsContextMenu from 'components/DocumentsContextMenu'
import AppBar from 'components/AppBar'
import AppSignPanel from 'components/AppSignPanel'

import * as NProgress from 'nprogress'

export class GraveyardView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    graveyard: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired
  };

  constructor () {
    super()
    this.fetchFollowingGhosts = this.fetchFollowingGhosts.bind(this)
  }

  componentDidUpdate (prevProps) {
    const {isProcessing} = this.props.graveyard
    const {isProcessing: wasProcessing} = prevProps.graveyard
    if (!wasProcessing && isProcessing) {
      NProgress.start()
    } else if (wasProcessing && !isProcessing) {
      NProgress.done()
    }
  }

  get title () {
    const { total } = this.props.graveyard
    const totalLabel = total ? <div className='ui tiny horizontal label'>{total}</div> : null
    return (
      <div>
        {totalLabel}
        <span>Trash</span>
      </div>
    )
  }

  get contextMenu () {
    return (<DocumentsContextMenu items='emptyGraveyard' />)
  }

  get header () {
    const bg = {backgroundColor: '#696969'}
    return (
      <AppBar title={this.title} styles={bg} contextMenu={this.contextMenu}>
        <div className='item'>
          <SearchBar />
        </div>
      </AppBar>
    )
  }

  get loader () {
    const { isFetching } = this.props.graveyard
    if (isFetching) {
      return (
        <div className='ui active inverted dimmer'>
          <div className='ui indeterminate text loader'>Loading deleted documents...</div>
        </div>
      )
    }
  }

  get ghosts () {
    const { isFetching, items, hasMore, error } = this.props.graveyard
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
          <i className='trash icon'></i>
          The trash is empty
        </AppSignPanel>
      )
    } else {
      const $items = items.map((doc) => <DocumentTile key={'doc-' + doc.id} value={doc} />)
      const sizes = ['one', 'three', 'five']
      const size = sizes[this.props.device.size - 1]
      return (
        <InfiniteGrid size={size} hasMore={hasMore} loadMore={this.fetchFollowingGhosts}>
          {$items}
        </InfiniteGrid>
      )
    }
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='ui main trash'>
          {this.ghosts}
          {this.loader}
        </div>
      </div>
    )
  }

  fetchFollowingGhosts () {
    const { actions, graveyard } = this.props
    const { params } = graveyard
    params.from++
    actions.graveyard.fetchGhosts(params)
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  graveyard: state.graveyard,
  device: state.device
})

const mapActionsToProps = (dispatch) => (bindActions({
  documents: DocumentsActions,
  graveyard: GraveyardActions,
  urlModal: UrlModalActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(GraveyardView)
