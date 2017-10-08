import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router'
import { bindActions } from 'store/helper'
import WebhookActions from 'store/webhook/actions'
import WebhooksActions from 'store/webhooks/actions'

import { actions as NotificationActions } from 'store/modules/notification'

import { Table, Icon, Button, Header, Divider, Dimmer, Loader, Modal } from 'semantic-ui-react'
import AppSignPanel from 'components/AppSignPanel'

class WebhooksTab extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    loc: PropTypes.object.isRequired,
    webhooks: PropTypes.object
  };

  constructor (props) {
    super(props)
    this.state = {
      webhookToDelete: null
    }
  }

  componentDidMount () {
    const { actions } = this.props
    actions.webhooks.fetchWebhooks()
  }

  handleDeleteWebhook = () => {
    const { actions } = this.props
    const { webhookToDelete } = this.state
    actions.webhook.removeWebhook(webhookToDelete).then(() => {
      this.setState({ webhookToDelete: null })
      actions.notification.showNotification({message: 'Webhook removed'})
    }, err => {
      this.setState({ webhookToDelete: null })
      actions.notification.showNotification({
        header: 'Unable to remove webhook',
        message: err.error,
        level: 'error'
      })
    })
  };

  renderRowButtons (webhook) {
    const askDeleteWebhook = () => this.setState({ webhookToDelete: webhook })
    const { loc } = this.props
    return (
      <div>
        <Button
          compact
          negative
          icon='remove'
          content='delete'
          onClick={askDeleteWebhook}
        />
        <Button as={Link}
          compact
          icon='edit'
          content='edit'
          to={{pathname: `/settings/webhooks/${webhook.id}`, state: {modal: true, returnTo: loc}}}
        />
      </div>
    )
  }

  renderRow (webhook) {
    const events = webhook.events.join(', ')
    const labels = webhook.labels.join(', ')
    return (
      <Table.Row key={`whk-${webhook.id}`}>
        <Table.Cell>
          {webhook.url} ({events})<br/>
          {labels}
        </Table.Cell>
        <Table.Cell collapsing textAlign='center'>
          {this.renderRowButtons(webhook)}
        </Table.Cell>
      </Table.Row>
    )
  }

  get rows () {
    const { current } = this.props.webhooks
    if (current && current.webhooks && current.webhooks.length) {
      return current.webhooks.map(item => this.renderRow(item))
    } else {
      return (
        <Table.Row disabled>
          <Table.Cell colSpan='2'>No webhook</Table.Cell>
        </Table.Row>
      )
    }
  }

  get table () {
    const { error } = this.props.webhooks
    if (error) {
      return (
        <AppSignPanel level='error'>
          <Icon name='bug' />
          {error.error || 'An error occurred!'}
        </AppSignPanel>
      )
    } else {
      const { loc } = this.props
      return (
        <Table singleLine>
          <Table.Body>
            {this.rows}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan='2'>
                <Button
                  as={Link}
                  primary
                  size='small'
                  icon='plus'
                  content='Add webhook'
                  labelPosition='left'
                  to={{pathname: '/settings/webhooks/create', state: {modal: true, returnTo: loc}}}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )
    }
  }

  get modal () {
    const open = this.state.webhookToDelete !== null
    const handleClose = () => this.setState({ webhookToDelete: null })

    return (
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Modal.Header>Delete webhook</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Are you sure to delete this webhook?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button negative content='no' onClick={handleClose} />
          <Button positive content='yes' onClick={this.handleDeleteWebhook} />
        </Modal.Actions>
      </Modal>
    )
  }

  render () {
    const { isProcessing } = this.props.webhooks
    return (
      <div>
        <Header size='small'>Webhooks</Header>
        <Divider />
        <p>
          Webhooks allow external services to be notified when certain events happen on your documents.
          When the specified events happen, we’ll send a POST request to each of the URLs you provide.
        </p>
        <Dimmer.Dimmable dimmed={isProcessing} >
          <Dimmer active={isProcessing} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
          {this.modal}
          {this.table}
        </Dimmer.Dimmable>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loc: state.router.locationBeforeTransitions,
  webhooks: state.webhooks
})

const mapActionsToProps = (dispatch) => (bindActions({
  webhook: WebhookActions,
  webhooks: WebhooksActions,
  notification: NotificationActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(WebhooksTab)
