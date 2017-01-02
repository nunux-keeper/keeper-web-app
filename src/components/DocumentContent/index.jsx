import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form } from 'semantic-ui-react'
import TinyMCE from 'react-tinymce'

import { actions as documentActions } from 'store/modules/document'

const API_ROOT = process.env.REACT_APP_API_ROOT

export class DocumentContent extends React.Component {
  static propTypes = {
    doc: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    updateDocument: PropTypes.func.isRequired
  };

  static defaultProps = {
    editable: false
  };

  constructor (props) {
    super(props)
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
  }

  componentDidMount () {
    this.filterImgDataRefAttr()
    this.filterImgSrcSetAttr()
  }

  componentDidUpdate () {
    this.filterImgDataRefAttr()
    this.filterImgSrcSetAttr()
  }

  filterImgDataRefAttr () {
    const { doc } = this.props
    // Filtering images ref attributes...
    const $this = ReactDOM.findDOMNode(this)
    $this.querySelectorAll('img[data-ref]').forEach((el) => {
      const key = el.dataset.ref
      const src = doc.sharing
        ? `${API_ROOT}/sharing/${doc.sharing}/${doc.id}/files/${key}`
        : `${API_ROOT}/documents/${doc.id}/files/${key}`
      el.src = src
    })
  }

  filterImgSrcSetAttr () {
    // Filtering images srcset  attributes...
    const $this = ReactDOM.findDOMNode(this)
    $this.querySelectorAll('img[srcset]').forEach((el) => {
      el.removeAttribute('srcset')
    })
  }

  handleEditorChange (e) {
    const { updateDocument, doc } = this.props
    updateDocument(doc, {content: e.target.getContent()})
  }

  handleContentChange (e) {
    const { updateDocument, doc } = this.props
    updateDocument(doc, {content: e.target.value})
  }

  renderEditMode () {
    const { doc } = this.props
    if (doc.contentType.match(/^text\/html/)) {
      const config = {
        inline: true,
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
        extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|name|data-src|app-src]'
      }
      return (
        <TinyMCE
          content={doc.content}
          config={config}
          onChange={this.handleEditorChange}
        />
      )
    } else {
      return (
        <Form as='div'>
          <Form.Field>
            <textarea
              value={doc.content}
              onChange={this.handleContentChange}>
            </textarea>
          </Form.Field>
        </Form>
      )
    }
  }

  renderViewMode () {
    const { doc } = this.props
    if (doc.contentType.match(/^text\/html/)) {
      return (
        <div
          ref='content'
          className='readable'
          dangerouslySetInnerHTML={{__html: doc.content}}
        />
      )
    } else {
      return (
        <pre ref='content'>{ doc.content }</pre>
      )
    }
  }

  render () {
    const { editable } = this.props
    return editable ? this.renderEditMode() : this.renderViewMode()
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, documentActions), dispatch)
)

export default connect(null, mapDispatchToProps)(DocumentContent)
