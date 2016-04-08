import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import AppBar from 'components/AppBar'
import DocumentContextMenu from 'components/DocumentContextMenu'
import DocumentLabels from 'components/DocumentLabels'

import styles from './DocumentView.scss'

export class DocumentView extends React.Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  get isModalDisplayed () {
    const routerState = this.props.location.state
    return routerState && routerState.modal
  }

  get originLink () {
    const { value: doc } = this.props.document
    if (doc.origin) {
      return (
        <span className={styles.origin}>
          Origin: <a href={doc.origin} target='_blank'>{doc.origin}</a>
        </span>
      )
    }
  }

  get contextMenu () {
    const { value: doc } = this.props.document
    return (
      <DocumentContextMenu doc={doc} items='edit,share,labels,delete' direction='left' />
    )
  }

  get header () {
    const { isFetching, value: doc } = this.props.document
    return (
      <AppBar
        modal={this.isModalDisplayed}
        title={isFetching || !doc ? 'Document' : doc.title}
        contextMenu={isFetching || !doc ? null : this.contextMenu}
      />
    )
  }

  get spinner () {
    const { isFetching } = this.props.document
    if (isFetching) {
      return (
        <div className='ui active dimmer'>
          <div className='ui large text loader'>Loading</div>
        </div>
      )
    }
  }

  get document () {
    const { isFetching, value: doc } = this.props.document
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

  get content () {
    const { value: doc } = this.props.document
    return (
      <div>
        {this.originLink}
        <DocumentLabels doc={doc} />
        <div className={styles.content}>
          {doc.content}
        </div>
        <span className={styles.modificationDate}>
          Last modification: {doc.date.toString()}
        </span>
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
  document: state.document,
  location: state.router.locationBeforeTransitions,
  labels: state.labels
})

export default connect(mapStateToProps)(DocumentView)

