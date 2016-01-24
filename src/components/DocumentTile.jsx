import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import GridTile from 'material-ui/lib/grid-list/grid-tile'
import Paper from 'material-ui/lib/paper'
import MoreVert from 'material-ui/lib/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/lib/icon-button'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'

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
    value: PropTypes.object.isRequired
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

  renderMenuButton () {
    return (
      <IconButton>
        <MoreVert color='white' />
      </IconButton>
    )
  }

  renderMenu () {
    return (
      <IconMenu iconButtonElement={this.renderMenuButton()}>
        <MenuItem primaryText='Share' />
        <MenuItem primaryText='Delete' />
      </IconMenu>
    )
  }

  render () {
    const doc = this.props.value
    return (
      <Paper zDepth={1}>
        <Link
          to={`/document/${doc.id}`}
          state={{ modal: true, returnTo: '/document', title: doc.title }}
          onClick={this.handleTouchTap}
          title={doc.title}>
          <GridTile
            key={doc.id}
            title={doc.title}
            href='ffff'
            subtitle={<span>by <b>{doc.origin}</b></span>}
            actionIcon={this.renderMenu()}>
            <img src='http://placehold.it/320x200' />
          </GridTile>
        </Link>
      </Paper>
    )
  }
}

