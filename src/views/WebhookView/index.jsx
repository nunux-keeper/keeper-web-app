import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Breadcrumb } from 'semantic-ui-react'
import { Link } from 'react-router'

import { bindActions } from '../../store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import WebhookActions from '../../store/webhook/actions'
import { actions as NotificationActions } from '../../store/modules/notification'

import AppBar from '../../components/AppBar'

export class WebhookView extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['create', 'edit']),
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    webhook: PropTypes.object.isRequired,
    loc: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      url: '',
      secret: '',
      events: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleChangeEvents = this.handleChangeEvents.bind(this)
  }

  get isEditMode () {
    const { mode } = this.props
    return mode === 'edit'
  }

  get isModalDisplayed () {
    const routerState = this.props.loc.state
    return routerState && routerState.modal
  }

  componentDidMount () {
    const { actions, params } = this.props
    if (this.isEditMode && params.id) {
      this.title = 'Edit webhook'
      actions.webhook.fetchWebhook(params.id)
    } else {
      this.title = 'New webhook'
      actions.webhook.resetWebhook()
    }
    document.title = this.title
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.webhook) {
      this.setState(nextProps.webhook.current)
    }
  }

  get header () {
    return (
      <AppBar
        modal={this.isModalDisplayed}
        title={this.title}
      />
    )
  }

  get breadcrumb () {
    if (!this.isModalDisplayed) {
      const to = {pathname: '/settings/webhooks'}
      return (
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to={to} title='Back to the webhooks'>Webhooks</Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>{this.title}</Breadcrumb.Section>
        </Breadcrumb>
      )
    }
  }

  get form () {
    const { isProcessing } = this.props.webhook
    const { url, secret, events } = this.state
    return (
      <Form loading={isProcessing} onSubmit={this.handleSubmit} >
        <Form.Input
          name='url'
          type='url'
          control='input'
          label='Payload URL'
          placeholder='https://example.com/postreceive'
          value={url}
          onChange={this.handleChangeInput}
          required
        />
        <Form.Input
          name='secret'
          type='text'
          control='input'
          label='Secret'
          value={secret}
          onChange={this.handleChangeInput}
        />
        <Form.Field>
          <label>Which events would you like to trigger this webhook?</label>
          <Form.Group inline>
            <Form.Checkbox
              name='events'
              label='Create'
              value='create'
              checked={events.includes('create')}
              onChange={(e, d) => this.handleChangeEvents(e, d)}
            />
            <Form.Checkbox
              name='events'
              label='Update'
              value='update'
              checked={events.includes('update')}
              onChange={this.handleChangeEvents}
            />
            <Form.Checkbox
              name='events'
              label='Remove'
              value='remove'
              checked={events.includes('remove')}
              onChange={this.handleChangeEvents}
            />
          </Form.Group>
        </Form.Field>

        <Form.Group>
          <Button secondary onClick={this.handleCancel}>Cancel</Button>
          <Button primary type='submit'>Submit</Button>
        </Form.Group>
      </Form>
    )
  }

  redirect (to) {
    const { actions, loc: {state} } = this.props
    if (state && state.returnTo) {
      actions.router.push(state.returnTo)
    } else {
      actions.router.push(to)
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    const { actions } = this.props
    const { url, secret, events } = this.state
    if (!this.isEditMode) {
      actions.webhook.createWebhook({url, secret, events}).then(webhook => {
        this.redirect('/settings/webhooks')
        actions.notification.showNotification({message: 'Webhook created'})
      }, err => {
        actions.notification.showNotification({
          header: 'Unable to create webhook',
          message: err.error,
          level: 'error'
        })
      })
    } else {
      actions.webhook.updateWebhook({url, secret, events}).then(webhook => {
        this.redirect('/settings/webhooks')
        actions.notification.showNotification({message: 'Webhook updated'})
      }, err => {
        actions.notification.showNotification({
          header: 'Unable to update webhook',
          message: err.error,
          level: 'error'
        })
      })
    }
    return false
  }

  handleCancel (e) {
    e.preventDefault()
    this.redirect('/settings/webhooks')
    return false
  }

  handleChangeInput (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleChangeEvents (event, {name, value, checked}) {
    const { events } = this.state
    if (checked) {
      this.setState({events: [value, ...events]})
    } else {
      this.setState({events: events.filter(evt => evt !== value)})
    }
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        {this.breadcrumb}
        <div className='viewContent'>
          {this.form}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loc: state.router.locationBeforeTransitions,
  webhook: state.webhook
})

const mapActionsToProps = (dispatch) => (bindActions({
  notification: NotificationActions,
  webhook: WebhookActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(WebhookView)
