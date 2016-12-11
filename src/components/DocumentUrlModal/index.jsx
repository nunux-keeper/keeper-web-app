import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Modal, Header, Message } from 'semantic-ui-react'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as DocumentActions } from 'store/modules/document'
import { actions as UrlModalActions } from 'store/modules/urlModal'

export class DocumentUrlModal extends React.Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    doc: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleCreateMethodChange = this.handleCreateMethodChange.bind(this)
    this.state = {
      url: '',
      method: 'default'
    }
  }

  get isValidUrl () {
    return this.state.url !== ''
  }

  get urlForm () {
    const { doc: {isProcessing} } = this.props
    const error = this.state.err ? this.state.err.error : null
    return (
      <Form onSubmit={this.handleSubmit} error={error !== null} loading={isProcessing}>
        <Message
          error
          header='Unable to create document'
          content={error}
        />
        <Form.Input
          name='url'
          type='url'
          label='Document URL'
          placeholder='Document title'
          value={this.state.url}
          onChange={this.handleUrlChange}
          error={!this.isValidUrl}
          required
        />
        <Form.Field>
          <label>Method</label>
          <Form.Group inline>
            <Form.Radio
              label='Extract content'
              name='method'
              value='default'
              checked={this.state.method === 'default'}
              onChange={this.handleCreateMethodChange} />
            <Form.Radio
              label='Bookmark the URL'
              name='method'
              value='bookmark'
              checked={this.state.method === 'bookmark'}
              onChange={this.handleCreateMethodChange} />
          </Form.Group>
        </Form.Field>
      </Form>
    )
  }

  render () {
    const { open } = this.props.modal
    const disabled = !this.isValidUrl
    return (
      <Modal
        open={open}
        onClose={this.handleClose}
        >
        <Header icon='linkify' content='Create document from an URL' />
        <Modal.Content>
          {this.urlForm}
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

  handleUrlChange (event) {
    this.setState({url: event.target.value})
  }

  handleCreateMethodChange (event, {value}) {
    this.setState({ method: value })
  }

  handleClose () {
    const { actions } = this.props
    actions.urlModal.hideUrlModal()
  }

  handleSubmit (e) {
    e.preventDefault()
    if (!this.isValidUrl) {
      return false
    }

    const {url, method} = this.state
    const u = method !== 'default' ? `${method}+${url}` : url

    const {actions} = this.props
    actions.document.createDocument({origin: u})
    .then((doc) => {
      actions.router.push({
        pathname: `/document/${doc.id}`
        // FIXME When modal documents view is crushed by the create view
        // state: { modal: true, returnTo: location }
      })
      actions.urlModal.hideUrlModal()
    }, (err) => {
      this.setState({err})
    })
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  modal: state.urlModal,
  doc: state.document
})

const mapActionsToProps = (dispatch) => (bindActions({
  document: DocumentActions,
  router: RouterActions,
  urlModal: UrlModalActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentUrlModal)
