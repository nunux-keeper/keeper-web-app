import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as documentActions } from 'redux/modules/document'
import { actions as navigationActions } from 'redux/modules/navigation'

import AppBar from 'material-ui/lib/app-bar'
import CircularProgress from 'material-ui/lib/circular-progress'
import LinearProgress from 'material-ui/lib/linear-progress'
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
    routing: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    toggleNavigation: PropTypes.func
  };

  componentDidMount () {
    const { fetchDocument } = this.props
    const { docId } = this.props.params
    fetchDocument(docId)
  }

  get doc () {
    return this.props.document.value
  }

  get isModalDisplayed () {
    const routerState = this.props.routing.location.state
    return routerState && routerState.modal
  }

  get originLink () {
    if (this.doc.origin) {
      return (
        <span className={ styles.origin }>
          Origin: <a href={this.doc.origin} target='_blank'>{this.doc.origin}</a>
        </span>
      )
    }
  }

  get header () {
    if (!this.isModalDisplayed) {
      const { toggleNavigation } = this.props
      const doc = this.props.document
      return (
        <AppBar
          title={ doc.isFetching ? 'Document' : this.doc.title }
          className='appBar'
          onLeftIconButtonTouchTap={() => toggleNavigation()}
        />
      )
    }
  }

  get spinner () {
    const { isFetching } = this.props.document
    if (isFetching) {
      if (this.doc) {
        return (
          <LinearProgress mode='indeterminate'/>
        )
      } else {
        return (
          <div className={styles.inProgress}><CircularProgress /></div>
        )
      }
    }
  }

  get document () {
    const { isFetching, value } = this.props.document
    if (value) {
      return (
        <div>
          {this.toolbar}
          <div className={ styles.document }>
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
        <div className={ styles.content }>
          {this.doc.content}
        </div>
        <span className={ styles.modificationDate }>
          Last modification: {this.doc.date.toString()}
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
    return (
      <div>
        {this.header}
        {this.spinner}
        {this.document}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  document: state.document,
  routing: state.routing
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, navigationActions, documentActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)

