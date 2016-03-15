import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import AppBar from 'components/AppBar'

import styles from './DocumentView.scss'

export class DocumentView extends React.Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired
  };

  get doc () {
    return this.props.document.value
  }

  get isModalDisplayed () {
    const routerState = this.props.location.state
    return routerState && routerState.modal
  }

  get originLink () {
    if (this.doc.origin) {
      return (
        <span className={styles.origin}>
          Origin: <a href={this.doc.origin} target='_blank'>{this.doc.origin}</a>
        </span>
      )
    }
  }

  get contextMenu () {
    return (
      <div className='menu'>
        <div className='item'>
          <i className='share alternate icon'></i>
          Share
        </div>
        <div className='item'>
          <i className='tags icon'></i>
          Change labels
        </div>
        <div className='item'>
          <i className='cloud upload icon'></i>
          Upload file
        </div>
        <div className='divider'></div>
        <div className='item'>
          <i className='edit icon'></i>
          Edit mode
        </div>
        <div className='divider'></div>
        <div className='item'>
          <i className='trash icon'></i>
          Remove
        </div>
      </div>
    )
  }

  get header () {
    if (!this.isModalDisplayed) {
      const doc = this.props.document

      return (
        <AppBar
          title={doc.isFetching ? 'Document' : this.doc.title}
          contextMenu={this.contextMenu}
        />
      )
    }
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
    const { isFetching, value } = this.props.document
    if (value) {
      return (
        <div>
          <div className={styles.document}>
            {this.content}
          </div>
        </div>
      )
    } else if (!isFetching) {
      return (
        <p className={styles.noDocument}>No document :(</p>
      )
    }
  }

  get content () {
    return (
      <div>
        {this.originLink}
        <div className={styles.content}>
          {this.doc.content}
        </div>
        <span className={styles.modificationDate}>
          Last modification: {this.doc.date.toString()}
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
  location: state.router.locationBeforeTransitions
})

export default connect(mapStateToProps)(DocumentView)

