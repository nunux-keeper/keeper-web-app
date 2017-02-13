import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

import { bindActions } from 'store/helper'
import authProvider from 'helpers/AuthProvider'

import { actions as AuthActions } from 'store/modules/auth'
import { actions as DocumentActions } from 'store/modules/document'

import './styles.css'

const basename = process.env.PUBLIC_URL || ''

export class BookmarkletView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    document: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.receiveMessage = this.receiveMessage.bind(this)
    this.close = this.close.bind(this)
    this.messages = []
    this.state = {
      onDragOver: false,
      content: null,
      error: null,
      success: null,
      authenticated: false,
      loading: true
    }
    props.actions.auth.initAuthentication()
      .then((response) => {
        this.setState({
          loading: false,
          authenticated: response.payload.authenticated
        })
      })
  }

  get baseUrl () {
    const { origin } = document.location
    return origin + basename
  }

  componentDidMount () {
    window.addEventListener('message', this.receiveMessage, false)
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.receiveMessage)
  }

  sendMessageBack (type, payload) {
    this.messages.push({_type: type, payload})
  }

  receiveMessage (event) {
    let msg
    try {
      msg = JSON.parse(event.data)
    } catch (e) {
      console.error('Unable to parse received event data', e)
      return
    }
    // eslint-disable-next-line
    switch (msg._type) {
      case 'ping':
        while (this.messages.length > 0) {
          const message = this.messages.shift()
          event.source.postMessage(JSON.stringify(message), event.origin)
        }
        break
      case 'onDragEnter':
        this.setState({onDragOver: true})
        break
      case 'onDragLeave':
        this.setState({onDragOver: false})
        break
      case 'onClick':
        this.submit()
        break
      case 'onDropData':
        this.setState({
          onDragOver: false,
          content: msg.data,
          error: null,
          success: null
        })
        break
    }
  }

  submitError () {
    this.setState({
      onDragOver: false,
      content: null,
      error: null,
      success: null,
      loading: false
    })
  }

  submitSuccess () {
    const { current: doc } = this.props.document
    window.open(`${this.baseUrl}/documents/${doc.id}`)
  }

  submitDoc () {
    this.setState({loading: true})

    const { actions, location } = this.props
    const doc = {
      title: location.query.title,
      origin: location.query.url
    }
    if (this.state.content) {
      doc.content = this.state.content
      doc.contentType = 'text/html'
    }
    actions.document.createDocument(doc)
    .then(() => {
      this.setState({
        loading: false,
        success: true,
        error: null,
        content: null
      })
    }, (err) => {
      this.setState({
        success: false,
        error: err,
        loading: false
      })
    })
  }

  submit () {
    const { success, error, authenticated } = this.state
    if (!authenticated) {
      const { location } = this.props
      const redirect = encodeURIComponent(location.query.url)
      const redirectUri = `${this.baseUrl}?redirect=${redirect}`
      const msg = authProvider.getLoginUrl({redirectUri})
      this.sendMessageBack('redirect', msg)
      this.setState({loading: true})
    } else if (error) {
      this.submitError()
    } else if (success) {
      this.submitSuccess()
    } else {
      this.submitDoc()
    }
  }

  close () {
    this.setState({loading: true})
    this.sendMessageBack('close')
  }

  get icon () {
    let icon = 'cloud upload'
    if (!this.state.authenticated) {
      icon = 'unlock'
    } else if (this.state.onDragOver) {
      icon = 'dropdown'
    } else if (this.state.error) {
      icon = 'warning sign'
    } else if (this.state.success) {
      icon = 'checkmark'
    }

    return (
      <Icon name={icon} />
    )
  }

  get color () {
    let color = 'transparent'
    if (this.state.onDragOver) {
      color = '#167AC6'
    } else if (this.state.error) {
      color = '#F51515'
    } else if (this.state.success) {
      color = '#21BA45'
    }
    return {
      backgroundColor: color
    }
  }

  get title () {
    let t = 'Send page to the Keeper'
    if (!this.state.authenticated) {
      t = 'Please login first'
    } else if (this.state.onDragOver) {
      t = 'Drop content on me'
    } else if (this.state.error) {
      t = 'Error!'
    } else if (this.state.success) {
      t = 'Kept! See the result?'
    } else if (this.state.content) {
      t = 'Send content to the Keeper'
    }
    return t
  }

  get dimmer () {
    if (this.state.loading) {
      return (
        <div className='ui active dimmer'>
          <div className='ui loader'></div>
        </div>
      )
    }
  }

  get dropZone () {
    return (
      <div className='dropzone' style={this.color}>
        <h3 className='ui icon header'>
          {this.icon}
          <div className='content'>{this.title}</div>
        </h3>
        {this.dimmer}
      </div>
    )
  }

  render () {
    return (
      <div className='bookmarklet'>
        <div className='ui top inverted borderless menu'>
          <div className='header item'>Keeper</div>
          <div className='right menu'>
            <a className='ui item' onClick={this.close}>
              <i className='remove icon' />
            </a>
          </div>
        </div>
        {this.dropZone}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  document: state.document
})

const mapActionsToProps = (dispatch) => (bindActions({
  auth: AuthActions,
  document: DocumentActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(BookmarkletView)
