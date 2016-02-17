import React, { PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as documentsActions } from 'redux/modules/documents'
import { actions as navigationActions } from 'redux/modules/navigation'

import AppBar from 'material-ui/lib/app-bar'
import CircularProgress from 'material-ui/lib/circular-progress'
import LinearProgress from 'material-ui/lib/linear-progress'
import Snackbar from 'material-ui/lib/snackbar'

import InfiniteGrid from 'react-infinite-grid'
import DocumentTile from 'components/DocumentTile'

import styles from './DocumentsView.scss'

export class DocumentsView extends React.Component {
  static propTypes = {
    documents: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    fetchDocuments: PropTypes.func.isRequired,
    restoreFromDocuments: PropTypes.func.isRequired,
    discardRestoredDocument: PropTypes.func.isRequired,
    discardRemovedDocument: PropTypes.func.isRequired,
    toggleNavigation: PropTypes.func
  };

  componentDidMount () {
    const { fetchDocuments, params } = this.props
    if (params.labelId) {
      fetchDocuments({label: params.labelId})
    } else {
      fetchDocuments()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { fetchDocuments, params } = this.props
    if (JSON.stringify(params.labelId) !== JSON.stringify(nextProps.params.labelId)) {
      fetchDocuments({label: params.labelId})
    }
  }

  get label () {
    const { labels, params } = this.props
    return params.labelId ? _.find(labels.items, (item) => params.labelId === item.id) : null
  }

  get title () {
    return this.label ? `Documents - ${this.label.label}` : 'Documents'
  }

  get header () {
    const { toggleNavigation } = this.props
    const bg = this.label ? {backgroundColor: this.label.color} : {}
    return (
      <AppBar
        title={ this.title }
        className='appBar'
        style={ bg }
        onLeftIconButtonTouchTap={() => toggleNavigation()}
      />
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

  get footer () {
    const { removed, restored } = this.props.documents
    return (
      <div>
        <Snackbar
          open={restored !== null && removed === null}
          message={'Document restored'}
          autoHideDuration={4000}
          onRequestClose={() => this.handleRequestClose()}
        />
        <Snackbar
          open={removed !== null && restored === null}
          message='Document removed'
          action='undo'
          autoHideDuration={4000}
          onRequestClose={() => this.handleRequestClose()}
          onActionTouchTap={ () => this.handleUndoRemove()}
        />
      </div>
    )
  }

  handleRequestClose () {
    const { removed } = this.props.documents
    if (removed) {
      this.props.discardRemovedDocument()
    } else {
      this.props.discardRestoredDocument()
    }
  }

  handleUndoRemove () {
    const { documents, restoreFromDocuments } = this.props
    restoreFromDocuments(documents.removed)
  }

  render () {
    return (
      <div>
        {this.header}
        {this.spinner}
        {this.documents}
        {this.footer}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  labels: state.labels,
  documents: state.documents
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, navigationActions, documentsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsView)
