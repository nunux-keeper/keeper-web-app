import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import { actions as documentsActions } from 'redux/modules/documents'
import { actions as notificationActions } from 'redux/modules/notification'

export class DocumentContextMenu extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    doc: PropTypes.object.isRequired,
    labels: PropTypes.object,
    items: PropTypes.string,
    direction: PropTypes.string,
    showNotification: PropTypes.func.isRequired,
    removeFromDocuments: PropTypes.func.isRequired,
    restoreFromDocuments: PropTypes.func.isRequired
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

  get editMenuItem () {
    if (this.state.menuItems.has('edit')) {
      <div className='item'>
        <i className='edit icon'></i>
        Edit mode
      </div>
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

  get labelsMenuItem () {
    const { direction } = this.props
    if (this.state.menuItems.has('labels')) {
      const { doc, labels } = this.props
      const items = labels.items.map(
        (label) => <div className='item' key={`menu-${doc.id}-${label.id}`}>
          <i className='square icon'></i>
          {label.label}
        </div>
      )

      return (
        <div className='item'>
          <i className={`${direction} dropdown icon`}></i>
          Labels
          <div className={`${direction} menu`}>
            {items}
          </div>
        </div>
      )
    }
  }

  render () {
    return (
      <div className='menu'>
        {this.detailMenuItem}
        {this.editMenuItem}
        {this.shareMenuItem}
        {this.labelsMenuItem}
        <div className='ui divider'></div>
        {this.deleteMenuItem}
      </div>
    )
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
    const {doc, removeFromDocuments, showNotification} = this.props
    removeFromDocuments(doc).then(() => {
      showNotification({
        level: 'info',
        header: 'Document removed',
        actionLabel: 'undo',
        actionFn: () => this.handleUndoRemove()
      })
    })
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  labels: state.labels
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions, documentsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentContextMenu)
