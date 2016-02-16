import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as documentActions } from '../../redux/modules/document'
import { actions as titleActions } from '../../redux/modules/title'

// import Card from 'material-ui/lib/card/card'
// import CardTitle from 'material-ui/lib/card/card-title'
// import CardText from 'material-ui/lib/card/card-text'
import IconButton from 'material-ui/lib/icon-button'
import RaisedButton from 'material-ui/lib/raised-button'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import Divider from 'material-ui/lib/divider'

import FontIcon from 'material-ui/lib/font-icon'

import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'

import styles from './DocumentView.scss'

export class DocumentView extends React.Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    updateTitle: PropTypes.func.isRequired
  };

  componentDidMount () {
    const { fetchDocument, updateTitle } = this.props
    fetchDocument().then(() => {
      const doc = this.props.document.value
      if (!this.isModalDisplayed) {
        updateTitle(doc.title)
      }
    })
  }

  get isModalDisplayed () {
    const routerState = this.props.router.state
    return routerState && routerState.modal
  }

  get originLink () {
    const doc = this.props.document.value
    if (doc.origin) {
      return (
        <span className={ styles.origin }>
          Origin: <a href={doc.origin} target='_blank'>{doc.origin}</a>
        </span>
      )
    }
  }

  get content () {
    const doc = this.props.document.value
    return (
      <div>
        {this.originLink}
        <div className={ styles.content }>
          {doc.content}
        </div>
        <span className={ styles.modificationDate }>
          Last modification: {doc.date.toString()}
        </span>
      </div>
    )
  }

  get moreButton () {
    return (
      <IconButton
        iconClassName='material-icons'
        tooltip='More...' tooltipPosition='bottom-center'>
        more_vert
      </IconButton>
    )
  }

  get toolbar () {
    return (
      <Toolbar className={ styles.toolbar }>
        <ToolbarGroup>
          <IconButton
            iconClassName='material-icons'
            tooltip='Edit document' tooltipPosition='bottom-center'>
            edit
          </IconButton>
          <IconButton
            iconClassName='material-icons'
            tooltip='Share document' tooltipPosition='bottom-center'>
            share
          </IconButton>
          <IconButton
            iconClassName='material-icons'
            tooltip='Edit labels' tooltipPosition='bottom-center'>
            label
          </IconButton>
          <IconMenu iconButtonElement={this.moreButton}>
            <MenuItem primaryText='Upload file' leftIcon={<FontIcon className='material-icons'>file_upload</FontIcon>}/>
            <Divider />
            <MenuItem primaryText='Remove' leftIcon={<FontIcon className='material-icons'>delete</FontIcon>}/>
          </IconMenu>
        </ToolbarGroup>
        <ToolbarGroup float='right'>
          <RaisedButton label='Save' primary />
        </ToolbarGroup>
      </Toolbar>
    )
  }

  render () {
    const doc = this.props.document.value

    if (doc) {
      return (
        <div>
          {this.toolbar}
          <div className={ styles.document }>
            {this.content}
          </div>
        </div>
      )
    } else {
      return (
        <p>LOADING...</p>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  document: state.document,
  router: state.router
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, titleActions, documentActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)

