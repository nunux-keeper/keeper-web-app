import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as documentsActions } from '../../redux/modules/documents'

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  documents: state.documents
})
export class DocumentsView extends React.Component {
  static propTypes = {
    documents: PropTypes.object.isRequired,
    fetchDocuments: PropTypes.func.isRequired,
    children: PropTypes.node
  };

  componentDidMount () {
    const { fetchDocuments } = this.props
    fetchDocuments()
  }

  render () {
    return (
      <div>
        <h2>Documents</h2>
        <ul>
          {this.props.documents.items.map((doc, i) =>
          <li key={doc.id}>{doc.title}</li>
          )}
        </ul>
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps, documentsActions)(DocumentsView)
