import React, { PropTypes } from 'react'
import { Link } from 'react-router'

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

  renderMenu () {
    const iconButtonElement = <IconButton>
      <FontIcon className='material-icons' color={Colors.white}>more_vert</FontIcon>
    </IconButton>

    return (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem primaryText='Share' leftIcon={<FontIcon className='material-icons'>share</FontIcon>}/>
        <MenuItem primaryText='Remove' leftIcon={<FontIcon className='material-icons'>delete</FontIcon>}/>
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
            subtitle={<span>by <b>{doc.origin}</b></span>}
            actionIcon={this.renderMenu()}>
            <img src='http://placehold.it/320x200' />
          </GridTile>
        </Link>
      </Paper>
    )
  }
}

