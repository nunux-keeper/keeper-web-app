import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as documentsActions } from 'redux/modules/documents'
import { actions as notificationActions } from 'redux/modules/notification'

export class DocumentTile extends React.Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    baseUrl: PropTypes.string.isRequired,
    showNotification: PropTypes.func.isRequired,
    removeFromDocuments: PropTypes.func.isRequired,
    restoreFromDocuments: PropTypes.func.isRequired
  };

  componentDidMount () {
    const doc = this.props.value
    window.jQuery(`#doc-${doc.id} .dropdown`).dropdown({
      transition: 'drop'
    })
  }

  handleUndoRemove () {
    const { restoreFromDocuments, showNotification } = this.props
    restoreFromDocuments().then(() => {
      showNotification({
        message: 'Document restored'
      })
    })
  }

  handleRemove () {
    const {value, removeFromDocuments, showNotification} = this.props
    removeFromDocuments(value).then(() => {
      showNotification({
        message: 'Document removed',
        actionLabel: 'undo',
        actionFn: () => this.handleUndoRemove()
      })
    })
  }

  get contextualMenu () {
    const { baseUrl } = this.props
    const doc = this.props.value
    return (
      <div className='ui icon top left pointing dropdown circular button'>
        <i className='ellipsis vertical icon'></i>
        <div className='menu'>
          <Link
            to={{ pathname: `${baseUrl}/${doc.id}` }}
            title={doc.title}
            className='item'>
            <i className='zoom icon'></i>
            View
          </Link>
          <div className='item'>
            <i className='share icon'></i>
            Share
          </div>
          <div className='ui divider'></div>
          <div className='item' onClick={this.handleRemove}>
            <i className='trash icon'></i>
            Delete
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { baseUrl } = this.props
    const doc = this.props.value
    const state = { modal: true, returnTo: baseUrl, title: doc.title }
    return (
      <div className='ui card' id={`doc-${doc.id}`}>
        <Link
          to={{ pathname: `${baseUrl}/${doc.id}`, state: state }}
          title={doc.title}
          className='image'>
          <img src='http://placehold.it/320x200' />
        </Link>
        <div className='content'>
          <Link
            to={{ pathname: `${baseUrl}/${doc.id}`, state: state }}
            title={doc.title}
            className='header'>
            {doc.title}
          </Link>
          <div clasName='meta'>
            <span>from <b>{doc.origin}</b></span>
          </div>
        </div>
        <div className='extra content'>

          <span className='right floated'>
            {this.contextualMenu}
          </span>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions, documentsActions), dispatch)
)

export default connect(null, mapDispatchToProps)(DocumentTile)
