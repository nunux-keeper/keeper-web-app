import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Header, Message } from 'semantic-ui-react'

import { bindActions } from 'store/helper'

import { actions as DocumentActions } from 'store/modules/document'
import { actions as TitleModalActions } from 'store/modules/titleModal'

export class DocumentTitleModal extends React.Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    doc: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.state = {
      title: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.modal.doc) {
      this.setState({title: nextProps.modal.doc.title})
    }
  }

  get isValidTitle () {
    return this.state.title !== ''
  }

  get titleForm () {
    const { doc: {isProcessing}, modal: {doc} } = this.props
    if (doc === null) {
      return
    }
    const error = this.state.err ? this.state.err.error : null
    return (
      <Form onSubmit={this.handleSubmit} error={error !== null} loading={isProcessing}>
        <Message
          error
          header='Unable to update document title'
          content={error}
        />
        <Form.Input
          name='title'
          type='text'
          label='Title'
          placeholder='Document title'
          value={this.state.title}
          onChange={this.handleTitleChange}
          error={!this.isValidTitle}
          required
        />
      </Form>
    )
  }

  render () {
    const {open} = this.props.modal
    const disabled = !this.isValidTitle
    return (
      <Modal
        open={open}
        onClose={this.handleClose}
        >
        <Header icon='font' content='Update title' />
        <Modal.Content>
          {this.titleForm}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleClose}>
            Cancel
          </Button>
          <Button primary disabled={disabled} onClick={this.handleSubmit}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  handleTitleChange (event) {
    this.setState({title: event.target.value})
  }

  handleClose () {
    const { actions } = this.props
    actions.titleModal.hideTitleModal()
  }

  handleSubmit (e) {
    e.preventDefault()
    if (!this.isValidTitle) {
      return false
    }
    const { actions, modal } = this.props
    actions.document.updateDocument(modal.doc, this.state)
    .then(() => this.handleClose(), (err) => {
      this.setState({err})
    })
  }
}

const mapStateToProps = (state) => ({
  modal: state.titleModal,
  doc: state.document
})

const mapActionsToProps = (dispatch) => (bindActions({
  document: DocumentActions,
  titleModal: TitleModalActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentTitleModal)
