import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as documentsActions } from 'redux/modules/documents'
import { actions as notificationActions } from 'redux/modules/notification'

import GridTile from 'material-ui/lib/grid-list/grid-tile'
import Paper from 'material-ui/lib/paper'
import IconButton from 'material-ui/lib/icon-button'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import FontIcon from 'material-ui/lib/font-icon'
import Colors from 'material-ui/lib/styles/colors'

function isInsideButton (el) {
  if (el.type === 'button') {
    return true
  }
  if (!el.parentNode) {
    return false
  }
  return isInsideButton(el.parentNode)
}

export default class DocumentTile extends React.Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    baseUrl: PropTypes.string.isRequired,
    showNotification: PropTypes.func.isRequired,
    removeFromDocuments: PropTypes.func.isRequired,
    restoreFromDocuments: PropTypes.func.isRequired
  };

  handleTouchTap (e) {
    // Little hack to reject event if trigger by a button (aka: the secondary action)
    if (isInsideButton(e.target)) {
      e.preventDefault()
      if (e.stopPropagation) {
        e.stopPropagation()
      } else {
        e.cancelBubble = true
      }
    }
  }

  handleUndoRemove () {
    const { restoreFromDocuments, showNotification } = this.props
    restoreFromDocuments().then(() => {
      showNotification({
        message: 'Document restored'
      })
    })
  }

  handleRemoveTouchTap () {
    const {value, removeFromDocuments, showNotification} = this.props
    removeFromDocuments(value).then(() => {
      showNotification({
        message: 'Document removed',
        actionLabel: 'undo',
        actionFn: () => this.handleUndoRemove()
      })
    })
  }

  renderMenu () {
    const iconButtonElement = <IconButton>
      <FontIcon className='material-icons' color={Colors.white}>more_vert</FontIcon>
    </IconButton>

    return (
      <IconMenu iconButtonElement={iconButtonElement} touchTapCloseDelay={0} >
        <MenuItem primaryText='Share' leftIcon={<FontIcon className='material-icons'>share</FontIcon>}/>
        <MenuItem
          primaryText='Remove'
          leftIcon={<FontIcon className='material-icons'>delete</FontIcon>}
          onTouchTap={() => this.handleRemoveTouchTap()}
        />
      </IconMenu>
    )
  }

  render () {
    const { baseUrl } = this.props
    const doc = this.props.value
    const state = { modal: true, returnTo: baseUrl, title: doc.title }
    return (
      <Paper zDepth={1}>
        <Link
          to={{ pathname: `${baseUrl}/${doc.id}`, state: state }}
          onClick={this.handleTouchTap}
          title={doc.title}>
          <GridTile
            key={doc.id}
            title={doc.title}
            subtitle={<span>from <b>{doc.origin}</b></span>}
            actionIcon={this.renderMenu()}>
            <img src='http://placehold.it/320x200' />
          </GridTile>
        </Link>
      </Paper>
    )
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, notificationActions, documentsActions), dispatch)
)

export default connect(null, mapDispatchToProps)(DocumentTile)
