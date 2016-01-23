import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as documentsActions } from '../../redux/modules/documents'

import GridList from 'material-ui/lib/grid-list/grid-list'
import GridTile from 'material-ui/lib/grid-list/grid-tile'
import StarBorder from 'material-ui/lib/svg-icons/toggle/star-border'
import IconButton from 'material-ui/lib/icon-button'

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

  renderTile (doc) {
    return (
      <GridTile
        key={doc.id}
        title={doc.title}
        subtitle={<span>by <b>{doc.origin}</b></span>}
        actionIcon={<IconButton><StarBorder color='white'/></IconButton>}>
        <img src='http://placehold.it/350x150' />
      </GridTile>)
  }

  render () {
    const gridListStyle = {width: 500, height: 400, overflowY: 'auto', marginBottom: 24}
    return (
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
        {/* Basic grid list with mostly default options */}
        <GridList cellHeight={200} style={gridListStyle}>
          {this.props.documents.items.map((doc, i) =>
          this.renderTile(doc)
          )}
        </GridList>
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps, documentsActions)(DocumentsView)
