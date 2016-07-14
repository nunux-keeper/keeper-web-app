import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as documentActions } from 'store/modules/document'
import { actions as titleModalActions } from 'store/modules/titleModal'

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
      const $form = this.refs.form
      window.$($form)
      .form({
        on: 'blur',
        fields: {
          title: ['empty']
        }
      })
    }
  }

  get isValid () {
    const $form = this.refs.form
    return $form && window.$($form).form('is valid')
  }

  render () {
    const doc = this.state
    if (!doc) return null
    const disabled = this.isValid ? '' : 'disabled'
    return (
      <div className='ui modal' ref='modal'>
        <div className='header'>Update title</div>
        <div className='content'>
          <form className='ui form' onSubmit={this.handleSubmit} ref='form'>
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
          <div className='ui cancel button'>Cancel</div>
          <div className={`ui primary approve button ${disabled}`}>Submit</div>
        </div>
      </div>
    )
  }

  handleChange (event) {
    this.setState({title: event.target.value})
  }

  handleSubmit () {
    if (this.isValid) {
      const { updateDocument, doc } = this.props
      updateDocument(doc, {title: this.state.title})
    }
  }
}

const mapStateToProps = (state) => ({
  doc: state.titleModal.content
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, documentActions, titleModalActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentTitleModal)
