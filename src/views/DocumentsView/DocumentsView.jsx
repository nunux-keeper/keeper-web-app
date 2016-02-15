import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as documentsActions } from '../../redux/modules/documents'
import { actions as titleActions } from '../../redux/modules/title'

import CircularProgress from 'material-ui/lib/circular-progress'
import Snackbar from 'material-ui/lib/snackbar'

import InfiniteGrid from 'react-infinite-grid'
import DocumentTile from 'components/DocumentTile'

import styles from './DocumentsView.scss'

export class DocumentsView extends React.Component {
  static propTypes = {
    documents: PropTypes.object.isRequired,
    fetchDocuments: PropTypes.func.isRequired,
    restoreFromDocuments: PropTypes.func.isRequired,
    discardRestoredDocument: PropTypes.func.isRequired,
    discardRemovedDocument: PropTypes.func.isRequired,
    updateTitle: PropTypes.func.isRequired
  };

  componentDidMount () {
    const { fetchDocuments, updateTitle } = this.props
    updateTitle('Documents')
    fetchDocuments()
  }

  get spinner () {
    const { isFetching } = this.props.documents
    if (isFetching) {
      return (
        <div className={styles.inProgress}><CircularProgress /></div>
      )
    }
  }

  get documents () {
    const items = this.props.documents.items.map((doc) => <DocumentTile value={doc} />)
    if (items.length) {
      return (
        <InfiniteGrid entries={items} wrapperHeight={400} height={200} />
      )
    } else {
      return (
        <p className={styles.noDocuments}>No documents :(</p>
      )
    }
  }

  get snackbar () {
    const { removed, restored } = this.props.documents
    if (removed || restored) {
      return (
        <Snackbar
          open
          message={ removed ? 'Document removed' : 'Document restored'}
          action={ removed ? 'undo' : null}
          autoHideDuration={4000}
          onRequestClose={() => this.handleRequestClose()}
          onActionTouchTap={ removed ? () => this.handleUndoRemove() : null}
        />
      )
    }
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
        {this.spinner}
        {this.documents}
        {this.snackbar}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  documents: state.documents
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, titleActions, documentsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsView)
