import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'

import { actions as DocumentsActions } from 'store/modules/documents'
import { actions as GraveyardActions } from 'store/modules/graveyard'
import { actions as UrlModalActions } from 'store/modules/urlModal'
import { actions as NotificationActions } from 'store/modules/notification'

import SearchBar from 'components/SearchBar'
import InfiniteGrid from 'components/InfiniteGrid'
import DocumentTile from 'components/DocumentTile'
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
    this.handleEmptyGraveyard = this.handleEmptyGraveyard.bind(this)
  }

  componentDidUpdate (prevProps) {
    const {isProcessing} = this.props.graveyard
    const {isProcessing: wasProcessing} = prevProps.graveyard
    if (!wasProcessing && isProcessing) {
      NProgress.start()
    } else if (wasProcessing && !isProcessing) {
      NProgress.done()
    }
    document.title = this.title
  }

  get title () {
    return 'Trash'
  }

  get header () {
    const { graveyard: {total} } = this.props
    const bg = {backgroundColor: '#696969'}
    const $totalLabel = total ? <small>[{total}]</small> : null
    const $title = <span><i className='trash icon'></i>{this.title} {$totalLabel}</span>
    return (
      <AppBar title={$title} styles={bg} >
        <div className='item stretch'>
          <SearchBar />
        </div>
        <a className='icon item' onClick={this.handleEmptyGraveyard} title='Empty the trash'>
          <i className='trash icon'></i>
        </a>
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
    return actions.graveyard.fetchGhosts(params)
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
  graveyard: state.graveyard,
  device: state.device
})

const mapActionsToProps = (dispatch) => (bindActions({
  documents: DocumentsActions,
  graveyard: GraveyardActions,
  notification: NotificationActions,
  urlModal: UrlModalActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(GraveyardView)
