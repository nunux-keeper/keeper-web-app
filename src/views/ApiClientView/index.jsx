import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Breadcrumb, Segment, Input, Popup, Header } from 'semantic-ui-react'
import { Link } from 'react-router'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import ClientActions from 'store/client/actions'
import { actions as NotificationActions } from 'store/modules/notification'

import AppBar from 'components/AppBar'

import authProvider from 'helpers/AuthProvider'

export class ApiClientView extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['create', 'edit']),
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    loc: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      realmUrl: authProvider.getRealmUrl(),
      name: '',
      redirectUris: [],
      webOrigins: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleRedirectUriListChange = this.handleRedirectUriListChange.bind(this)
    this.handleWebOriginListChange = this.handleWebOriginListChange.bind(this)
    this.addRedirectUriInput = this.addRedirectUriInput.bind(this)
    this.addWebOriginInput = this.addWebOriginInput.bind(this)
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
      this.title = 'Edit API client'
      actions.client.fetchClient(params.id)
    } else {
      this.title = 'New API client'
      actions.client.resetClient()
    }
    document.title = this.title
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.client) {
      this.setState(nextProps.client.current)
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
      const to = {pathname: '/settings/api-clients'}
      return (
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to={to} title='Back to the API clients'>API clients</Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>{this.title}</Breadcrumb.Section>
        </Breadcrumb>
      )
    }
  }

  get redirectUriFormGroup () {
    const { redirectUris } = this.state
    return redirectUris.map((uri, idx) => {
      return (
        <Form.Field key={'redirect-uri-input' + idx}>
          <Input
            type='url'
            placeholder='https://example.com/'
            value={uri}
            icon={{ name: 'remove', circular: true, link: true, onClick: this.removeRedirectUriInput.bind(this, idx) }}
            onChange={this.handleRedirectUriListChange.bind(this, idx)}
            required
          />
        </Form.Field>
        )
    })
  }

  get webOriginFormGroup () {
    const { webOrigins } = this.state
    return webOrigins.map((origin, idx) => {
      return (
        <Form.Field key={'web-origin-input' + idx}>
          <Input
            type='url'
            placeholder='https://example.com/'
            value={origin}
            icon={{ name: 'remove', circular: true, link: true, onClick: this.removeWebOriginInput.bind(this, idx) }}
            onChange={this.handleWebOriginListChange.bind(this, idx)}
            required
          />
        </Form.Field>
        )
    })
  }

  get infos () {
    const client = this.props.client.current
    if (this.isEditMode && client.clientId !== '') {
      const { clientId, secret } = client
      const { realmUrl } = this.state
      const discoveryUrl = `${realmUrl}/.well-known/openid-configuration`
      return (
        <Segment>
          <Header as='h5'>
            Configure your OpenID Connect client app using these informations:
          </Header>
          <Form>
            <Form.Field>
              <label>Discovery URL</label>
              <a href={discoveryUrl} target='_blank' title='Discovery URL'>
                {discoveryUrl}
              </a>
            </Form.Field>
            <Form.Field>
              <label>Client ID</label>
              <Input
                defaultValue={clientId}
                action={{ color: 'teal', labelPosition: 'right', icon: 'copy', content: 'Copy', onClick: this.handleClientIdCopy }}
                ref={this.handleClientIdRef}
              />
            </Form.Field>
            <Form.Field>
              <label>Client secret</label>
              <Input
                defaultValue={secret}
                action={{ color: 'teal', labelPosition: 'right', icon: 'copy', content: 'Copy', onClick: this.handleClientSecretCopy }}
                ref={this.handleClientSecretRef}
              />
            </Form.Field>
          </Form>
        </Segment>
      )
    }
    return null
  }

  get form () {
    const { isProcessing } = this.props.client
    const { name } = this.state
    return (
      <Form loading={isProcessing} onSubmit={this.handleSubmit} >
        <Form.Input
          name='name'
          type='text'
          control='input'
          label='Client name'
          placeholder='My super client'
          value={name}
          onChange={this.handleInputChange}
          required
        />
        <Form.Field>
          <Popup trigger={<label>Valid redirect URI:</label>} wide='very'>
            Valid URI pattern a browser can redirect to after a successful login or logout.
            Simple wildcards are allowed i.e. 'http://example.com/*'.
          </Popup>
          {this.redirectUriFormGroup}
          <Button icon='plus' size='tiny' compact onClick={this.addRedirectUriInput} />
        </Form.Field>
        <Form.Field>
          <Popup trigger={<label>Valid web origins:</label>} wide='very'>
            Allowed CORS origins. If no web origin is provided, all origins of Valid Redirect URIs are used.
          </Popup>
          {this.webOriginFormGroup}
          <Button icon='plus' size='tiny' compact onClick={this.addWebOriginInput} />
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

  handleClientIdRef = (c) => {
    this.clientIdRef = c
  };

  handleClientSecretRef = (c) => {
    this.clientSecretRef = c
  };

  handleClientIdCopy = () => {
    this.clientIdRef.inputRef.select()
    document.execCommand('copy')
  };

  handleClientSecretCopy = () => {
    this.clientSecretRef.inputRef.select()
    document.execCommand('copy')
  };

  handleSubmit (e) {
    e.preventDefault()
    const { actions } = this.props
    const { name, redirectUris, webOrigins } = this.state
    if (!this.isEditMode) {
      actions.client.createClient({name, redirectUris, webOrigins}).then(client => {
        this.redirect('/settings/api-clients')
        actions.notification.showNotification({message: 'Client created'})
      }, err => {
        actions.notification.showNotification({
          header: 'Unable to create client',
          message: err.error,
          level: 'error'
        })
      })
    } else {
      actions.client.updateClient({name, redirectUris, webOrigins}).then(client => {
        this.redirect('/settings/api-clients')
        actions.notification.showNotification({message: 'Client updated'})
      }, err => {
        actions.notification.showNotification({
          header: 'Unable to update client',
          message: err.error,
          level: 'error'
        })
      })
    }
    return false
  }

  handleCancel (e) {
    e.preventDefault()
    this.redirect('/settings/clients')
    return false
  }

  handleInputChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleWebOriginListChange (index, event) {
    const webOrigins = this.state.webOrigins.slice()
    webOrigins[index] = event.target.value
    this.setState({webOrigins})
  }

  handleRedirectUriListChange (index, event) {
    const redirectUris = this.state.redirectUris.slice()
    redirectUris[index] = event.target.value
    this.setState({redirectUris})
  }

  removeWebOriginInput (index) {
    const webOrigins = this.state.webOrigins.slice()
    webOrigins.splice(index, 1)
    this.setState({webOrigins})
  }

  removeRedirectUriInput (index) {
    const redirectUris = this.state.redirectUris.slice()
    redirectUris.splice(index, 1)
    this.setState({redirectUris})
  }

  addWebOriginInput () {
    const webOrigins = this.state.webOrigins.slice()
    if (webOrigins.length < 3) {
      webOrigins.push('')
      this.setState({webOrigins})
    }
    return false
  }

  addRedirectUriInput () {
    const redirectUris = this.state.redirectUris.slice()
    if (redirectUris.length < 3) {
      redirectUris.push('')
      this.setState({redirectUris})
    }
    return false
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        {this.breadcrumb}
        <div className='viewContent'>
          {this.infos}
          {this.form}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loc: state.router.locationBeforeTransitions,
  client: state.client
})

const mapActionsToProps = (dispatch) => (bindActions({
  notification: NotificationActions,
  client: ClientActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(ApiClientView)
