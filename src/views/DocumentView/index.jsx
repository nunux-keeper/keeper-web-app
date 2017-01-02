import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Menu, Dimmer, Loader, Dropdown } from 'semantic-ui-react'

import AppBar from 'components/AppBar'
import DocumentContextMenu from 'components/DocumentContextMenu'
import DocumentLabels from 'components/DocumentLabels'
import DocumentContent from 'components/DocumentContent'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as DocumentActions } from 'store/modules/document'

import * as NProgress from 'nprogress'

import './styles.css'

export class DocumentView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    document: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.redirectBack = this.redirectBack.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // if no document found then redirect...
    if (
      !nextProps.document.isFetching &&
      !nextProps.document.isProcessing &&
      !nextProps.document.current
    ) {
      console.debug('No more document. Redirecting...')
      this.redirectBack()
    }
  }

  componentDidUpdate (prevProps) {
    if (!this.isModalDisplayed) {
      // Display progress bar if main view
      const {isProcessing} = this.props.document
      const {isProcessing: wasProcessing} = prevProps.document
      if (!wasProcessing && isProcessing) {
        NProgress.start()
      } else if (wasProcessing && !isProcessing) {
        NProgress.done()
      }
    }
    document.title = this.title
  }

  redirectBack () {
    const {actions, location} = this.props
    if (location.state && location.state.returnTo) {
      const {pathname, search} = location.state.returnTo
      actions.router.push({
        pathname: pathname,
        search: search,
        state: {
          backFromModal: true
        }
      })
    } else {
      const url = location.pathname
      const to = url.substr(0, url.lastIndexOf('/'))
      actions.router.push(to)
    }
  }

  get isModalDisplayed () {
    const routerState = this.props.location.state
    return routerState && routerState.modal
  }

  get isCreateMode () {
    const { current: doc } = this.props.document
    return doc !== null && doc.id == null
  }

  get originLink () {
    const { current: doc } = this.props.document
    if (doc.origin) {
      return (
        <span className='originLink'>
          Origin: <a href={doc.origin} target='_blank'>{doc.origin}</a>
        </span>
      )
    }
  }

  get contextMenuItems () {
    const { isFetching, current: doc } = this.props.document
    switch (true) {
      case this.isCreateMode:
        return 'editTitle'
      case isFetching || !doc:
        return ''
      case !doc.sharing:
        return 'raw,share,divider,editTitle,edit,divider,delete'
      default:
        return 'raw'
    }
  }

  get contextMenu () {
    const { isFetching, current: doc } = this.props.document
    if (!isFetching && doc) {
      return (
        <Menu.Item as={Dropdown} className='hack ellipsis-v'>
          <DocumentContextMenu doc={doc} items={this.contextMenuItems} direction='left' />
        </Menu.Item>
      )
    }
  }

  get editButtons () {
    const { isEditing } = this.props.document
    if (isEditing) {
      const { actions } = this.props
      const resetFn = this.isCreateMode ? this.redirectBack : actions.document.resetDocument
      const submitFn = actions.document.submitDocument
      return (
        <Menu.Item>
          <Button onClick={resetFn}>Cancel</Button>
          &nbsp;
          <Button primary onClick={submitFn}>Save</Button>
        </Menu.Item>
      )
    }
  }

  get title () {
    const { isFetching, current: doc } = this.props.document
    return isFetching || !doc ? 'Document' : doc.title
  }

  get header () {
    return (
      <AppBar
        modal={this.isModalDisplayed}
        title={this.title}>
        <Menu.Menu className='right'>
          {this.editButtons}
          {this.contextMenu}
        </Menu.Menu>
      </AppBar>
    )
  }

  get document () {
    const { isFetching, isProcessing, isEditing, current: doc } = this.props.document
    if (doc && !isFetching && !isProcessing) {
      return (
        <div>
          {this.originLink}
          <DocumentLabels doc={doc} editable={isEditing}/>
          <DocumentContent doc={doc} editable={isEditing}/>
          {this.modificationDate}
        </div>
      )
    }
  }

  get modificationDate () {
    const { current: doc } = this.props.document
    if (doc.date) {
      const date = String(doc.date)
      return (
        <span className='modificationDate'>
          Last modification: {date}
        </span>
      )
    }
  }

  render () {
    const { isFetching, isProcessing } = this.props.document
    return (
      <div className='view'>
        {this.header}
        <Dimmer.Dimmable dimmed={isFetching || isProcessing} className='viewContent' >
          <Dimmer active={isFetching || isProcessing} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
          {this.document}
        </Dimmer.Dimmable>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  document: state.document,
  location: state.router.locationBeforeTransitions
})

const mapActionsToProps = (dispatch) => (bindActions({
  document: DocumentActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentView)

