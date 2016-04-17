import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as documentsActions } from 'redux/modules/documents'
import { actions as titleModalActions } from 'redux/modules/titleModal'

export class DocumentTitleModal extends React.Component {
  static propTypes = {
    doc: PropTypes.object,
    hideTitleModal: PropTypes.func.isRequired,
    updateDocument: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = props.doc
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.doc) {
      this.setState(nextProps.doc)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.doc === null && this.props.doc) {
      const $modal = this.refs.modal
      const { hideTitleModal } = this.props
      window.$($modal)
      .modal({
        detachable: false,
        onHidden: hideTitleModal,
        onApprove: this.handleSubmit
      })
      .modal('show')
    }
  }

  render () {
    const doc = this.state
    if (!doc) return null
    const disabled = doc.title !== '' ? '' : 'disabled'
    return (
      <div className='ui modal' ref='modal'>
        <div className='header'>Update title</div>
        <div className='content'>
          <form className='ui form' onSubmit={this.handleSubmit}>
            <div className='field'>
              <label>Title</label>
              <input
                type='text'
                name='title'
                required
                value={doc.title}
                onChange={this.handleChange}
                placeholder='Document title'
              />
            </div>
          </form>
        </div>
        <div className='actions'>
          <div className={`ui positive approve button ${disabled}`}>Submit</div>
          <div className='ui black cancel button'>Cancel</div>
        </div>
      </div>
    )
  }

  handleChange (event) {
    this.setState({title: event.target.value})
  }

  handleSubmit () {
    const { updateDocument, doc } = this.props
    updateDocument(doc, {title: this.state.title})
  }
}

const mapStateToProps = (state) => ({
  doc: state.titleModal.content
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, documentsActions, titleModalActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentTitleModal)
