import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'

import AppBar from 'components/AppBar'
import DocumentContextMenu from 'components/DocumentContextMenu'
import DocumentLabels from 'components/DocumentLabels'
import DocumentContent from 'components/DocumentContent'

import * as NProgress from 'nprogress'

import styles from './DocumentView.scss'

export class DocumentView extends React.Component {
  static propTypes = {
    documents: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func
  };

  componentWillReceiveProps (nextProps) {
    // if no document found then redirect...
    if (
      !nextProps.documents.isFetching &&
      !nextProps.documents.isProcessing &&
      !nextProps.documents.current
    ) {
      console.debug('No more document. Redirecting...')
      const {push, location} = this.props
      if (location.state && location.state.returnTo) {
        const {pathname, search} = location.state.returnTo
        push({
          pathname: pathname,
          search: search,
          state: {
            backFromModal: true
          }
        })
      } else {
        const url = location.pathname
        const to = url.substr(0, url.lastIndexOf('/'))
        push(to)
      }
    }
  }

  componentDidUpdate (prevProps) {
    if (!this.isModalDisplayed) {
      const {isProcessing} = this.props.documents
      const {isProcessing: wasProcessing} = prevProps.documents
      if (!wasProcessing && isProcessing) {
        NProgress.start()
      } else if (wasProcessing && !isProcessing) {
        NProgress.done()
      }
    }
  }

  get isModalDisplayed () {
    const routerState = this.props.location.state
    return routerState && routerState.modal
  }

  get isCreateMode () {
    const { current: doc } = this.props.documents
    return doc !== null && doc.id == null
  }

  get originLink () {
    const { current: doc } = this.props.documents
    if (doc.origin) {
      return (
        <span className={styles.origin}>
          Origin: <a href={doc.origin} target='_blank'>{doc.origin}</a>
        </span>
      )
    }
  }

  get contextMenu () {
    const { current: doc } = this.props.documents
    const menuItems = this.isCreateMode ? 'editTitle' : 'editTitle,share,delete'
    return (
      <DocumentContextMenu doc={doc} items={menuItems} direction='left' />
    )
  }

  get saveButton () {
    if (this.isCreateMode) {
      return (
        <div className='item'>
          <div className='ui primary button'>Save</div>
        </div>
      )
    }
  }

  get header () {
    const { isFetching, current: doc } = this.props.documents
    return (
      <AppBar
        modal={this.isModalDisplayed}
        title={isFetching || !doc ? 'Document' : doc.title}
        contextMenu={isFetching || !doc ? null : this.contextMenu}>
        {this.saveButton}
      </AppBar>
    )
  }

  get spinner () {
    const { isFetching } = this.props.documents
    if (isFetching) {
      return (
        <div className='ui active inverted dimmer'>
          <div className='ui large text loader'>Loading</div>
        </div>
      )
    }
  }

  get document () {
    const { isFetching, current: doc } = this.props.documents
    if (doc) {
      return (
        <div>
          {this.content}
        </div>
      )
    } else if (!isFetching) {
      return (
        <p className={styles.noDocument}>No document :(</p>
      )
    }
  }

  get modificationDate () {
    const { current: doc } = this.props.documents
    if (doc.date) {
      const date = String(doc.date)
      return (
        <span className={styles.modificationDate}>
          Last modification: {date}
        </span>
      )
    }
  }

  get content () {
    const { current: doc } = this.props.documents
    return (
      <div>
        {this.originLink}
        <DocumentLabels doc={doc} editable/>
        <DocumentContent doc={doc} editable/>
        {this.modificationDate}
      </div>
    )
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='ui main'>
          {this.spinner}
          {this.document}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  documents: state.documents,
  location: state.router.locationBeforeTransitions
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routerActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)

