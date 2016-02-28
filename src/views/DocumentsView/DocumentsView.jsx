import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { actions as navigationActions } from 'redux/modules/navigation'

import AppBar from 'material-ui/lib/app-bar'
import CircularProgress from 'material-ui/lib/circular-progress'
import LinearProgress from 'material-ui/lib/linear-progress'
import Divider from 'material-ui/lib/divider'
import IconButton from 'material-ui/lib/icon-button'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert'
import MenuItem from 'material-ui/lib/menus/menu-item'

import InfiniteGrid from 'react-infinite-grid'
import SearchBar from 'components/SearchBar'
import DocumentTile from 'components/DocumentTile'

import styles from './DocumentsView.scss'

export class DocumentsView extends React.Component {
  static propTypes = {
    routing: PropTypes.object.isRequired,
    documents: PropTypes.object.isRequired,
    label: PropTypes.object.isRequired,
    toggleNavigation: PropTypes.func
  };

  get label () {
    const { label } = this.props
    return label.value
  }

  get title () {
    return this.label ? `Documents - ${this.label.label}` : 'Documents'
  }

  get contextMenu () {
    const { routing } = this.props
    const labelSpecificMenu = this.label ? <div>
      <Divider />
      <Link to={{ pathname: `/label/${this.label.id}/edit`, state: {modal: true, returnTo: routing.location.pathname, title: `Edit label: ${this.label.label}`} }}>
        <MenuItem primaryText='Edit Label' />
      </Link>
    </div> : null
    return (
      <IconMenu
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
        <MenuItem primaryText='Refresh' />
        { labelSpecificMenu }
      </IconMenu>
    )
  }

  get header () {
    const { toggleNavigation } = this.props
    const bg = this.label ? {backgroundColor: this.label.color} : {}

    return (
      <div>
        <AppBar
          title={ this.title }
          className='appBar'
          style={ bg }
          iconElementRight={this.contextMenu}
          onLeftIconButtonTouchTap={() => toggleNavigation()}
        />
        <SearchBar />
      </div>
    )
  }

  get spinner () {
    const { isFetching, items } = this.props.documents
    if (isFetching) {
      if (items.length) {
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

  get documents () {
    const { isFetching } = this.props.documents
    const baseUrl = this.label ? `/label/${this.label.id}` : '/document'
    const items = this.props.documents.items.map((doc) => <DocumentTile value={doc} baseUrl={baseUrl} />)
    if (items.length) {
      return (
        <InfiniteGrid entries={items} wrapperHeight={400} height={200} />
      )
    } else if (!isFetching) {
      return (
        <p className={styles.noDocuments}>No documents :(</p>
      )
    }
  }

  render () {
    return (
      <div>
        {this.header}
        {this.spinner}
        {this.documents}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  routing: state.routing,
  label: state.label,
  documents: state.documents
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, navigationActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsView)
