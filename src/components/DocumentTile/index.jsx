import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as documentsActions } from 'redux/modules/documents'
import { actions as notificationActions } from 'redux/modules/notification'

import './styles.scss'

export class DocumentTile extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    showNotification: PropTypes.func.isRequired,
    removeFromDocuments: PropTypes.func.isRequired,
    restoreFromDocuments: PropTypes.func.isRequired
  };

  constructor () {
    super()
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUndoRemove = this.handleUndoRemove.bind(this)
  }

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
        level: 'info',
        header: 'Document restored'
      })
    })
  }

  handleRemove () {
    const {value, removeFromDocuments, showNotification} = this.props
    removeFromDocuments(value).then(() => {
      showNotification({
        level: 'info',
        header: 'Document removed',
        actionLabel: 'undo',
        actionFn: () => this.handleUndoRemove()
      })
    })
  }

  get contextualMenu () {
    const { pathname } = this.props.location
    const doc = this.props.value
    return (
      <div className='ui icon top left pointing dropdown circular button'>
        <i className='ellipsis vertical icon'></i>
        <div className='menu'>
          <Link
            to={{ pathname: `${pathname}/${doc.id}` }}
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
    const { location } = this.props
    const doc = this.props.value
    const state = { modal: true, returnTo: location, title: doc.title }
    return (
      <div className='ui card doc' id={`doc-${doc.id}`}>
        <Link
          to={{ pathname: `${location.pathname}/${doc.id}`, state: state }}
          title={doc.title}
          className='image'>
          <img src='http://placehold.it/320x200' />
        </Link>
        <div className='content'>
          <Link
            to={{ pathname: `${location.pathname}/${doc.id}`, state: state }}
            title={doc.title}
            className='header'>
            {doc.title}
          </Link>
          <span className='meta'>
            from&nbsp;
            <a href={doc.origin} target='_blank' title={doc.origin}>
              {doc.origin}
            </a>
          </span>
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

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions, documentsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentTile)
