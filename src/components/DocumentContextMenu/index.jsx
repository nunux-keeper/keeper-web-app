import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import { actions as documentsActions } from 'redux/modules/documents'
import { actions as notificationActions } from 'redux/modules/notification'
import { actions as titleModalActions } from 'redux/modules/titleModal'

export class DocumentContextMenu extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    doc: PropTypes.object.isRequired,
    items: PropTypes.string,
    direction: PropTypes.string,
    showNotification: PropTypes.func.isRequired,
    removeDocument: PropTypes.func.isRequired,
    restoreRemovedDocument: PropTypes.func.isRequired,
    showTitleModal: PropTypes.func.isRequired
  };

  static defaultProps = {
    direction: 'right'
  };

  constructor (props) {
    super(props)
    this.state = {
      menuItems: new Set(props.items.split(','))
    }
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUndoRemove = this.handleUndoRemove.bind(this)
    this.handleEditTitle = this.handleEditTitle.bind(this)
  }

  get detailMenuItem () {
    if (this.state.menuItems.has('detail')) {
      const { pathname } = this.props.location
      const doc = this.props.doc
      return (
        <Link
          to={{ pathname: `${pathname}/${doc.id}` }}
          title={doc.title}
          className='item'>
          <i className='zoom icon'></i>
          View
        </Link>
      )
    }
  }

  get editTitleMenuItem () {
    if (this.state.menuItems.has('editTitle')) {
      return (
        <div className='item' onClick={this.handleEditTitle}>
          <i className='edit icon'></i>
          Edit title
        </div>
      )
    }
  }

  get editMenuItem () {
    if (this.state.menuItems.has('edit')) {
      return (
        <div className='item'>
          <i className='edit icon'></i>
          Edit mode
        </div>
      )
    }
  }

  get shareMenuItem () {
    if (this.state.menuItems.has('share')) {
      return (
        <div className='item'>
          <i className='share alternate icon'></i>
          Share
        </div>
      )
    }
  }

  get deleteMenuItem () {
    if (this.state.menuItems.has('delete')) {
      return (
        <div className='item' onClick={this.handleRemove}>
          <i className='trash icon'></i>
          Delete
        </div>
      )
    }
  }

  get deleteMenuDivider () {
    if (this.state.menuItems.has('delete')) {
      return (<div className='ui divider'></div>)
    }
  }

  render () {
    return (
      <div className='menu'>
        {this.detailMenuItem}
        {this.editTitleMenuItem}
        {this.editMenuItem}
        {this.shareMenuItem}
        {this.deleteMenuDivider}
        {this.deleteMenuItem}
      </div>
    )
  }

  handleUndoRemove () {
    const { restoreRemovedDocument, showNotification } = this.props
    restoreRemovedDocument().then(() => {
      showNotification({
        level: 'info',
        header: 'Document restored'
      })
    })
  }

  handleRemove () {
    const {doc, removeDocument, showNotification} = this.props
    removeDocument(doc).then(() => {
      showNotification({
        level: 'info',
        header: 'Document removed',
        actionLabel: 'undo',
        actionFn: () => this.handleUndoRemove()
      })
    })
  }

  handleEditTitle () {
    const { showTitleModal, doc } = this.props
    showTitleModal(doc)
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions, documentsActions, titleModalActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentContextMenu)
