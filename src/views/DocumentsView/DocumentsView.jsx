import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as documentsActions } from '../../redux/modules/documents'
import { actions as titleActions } from '../../redux/modules/title'

import InfiniteGrid from 'react-infinite-grid'
import DocumentTile from 'components/DocumentTile'

export class DocumentsView extends React.Component {
  static propTypes = {
    documents: PropTypes.object.isRequired,
    fetchDocuments: PropTypes.func.isRequired,
    updateTitle: PropTypes.func.isRequired,
    children: PropTypes.node
  };

  componentDidMount () {
    const { fetchDocuments, updateTitle } = this.props
    updateTitle('Documents')
    fetchDocuments()
  }

  render () {
    const items = this.props.documents.items.map((doc) => <DocumentTile value={doc} />)
    if (items.length) {
      return (
        <InfiniteGrid entries={items} height={200} />
      )
    } else {
      return (
        <p>No documents</p>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  documents: state.documents
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, titleActions, documentsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsView)
