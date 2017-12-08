import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'
import ProfileActions from 'store/profile/actions'
import { actions as NotificationActions } from 'store/modules/notification'

import { Modal, Message, Icon, Input, Button, Header, Divider, Segment } from 'semantic-ui-react'

const API_ROOT = process.env.REACT_APP_API_ROOT
const _parts = API_ROOT.split('://')
const API_KEY_URL = `${_parts[0]}://api:KEY@${_parts[1]}`

class ApiKeyTab extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    profile: PropTypes.object
  };

  state = { modalOpen: false };

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  handleRef = (c) => {
    this.inputRef = c
  };

  handleCopy = () => {
    this.inputRef.inputRef.select()
    document.execCommand('copy')
  };

  handleGenerateApiKey = () => {
    this.handleClose()
    const { actions } = this.props
    actions.profile.updateProfile({resetApiKey: true}).then((profile) => {
    }).catch((err) => {
      actions.notification.showNotification({
        header: 'Unable to generate API key',
        message: err.error,
        level: 'error'
      })
    })
  };

  get apiKey () {
    const profile = this.props.profile.current

    if (profile && profile.apiKey) {
      return (
        <Message success>
          <Message.Content>
            <Message.Header>
              API key generated with success
            </Message.Header>
            <Input
              action={{ color: 'teal', labelPosition: 'right', icon: 'copy', content: 'Copy', onClick: this.handleCopy }}
              defaultValue={profile.apiKey}
              ref={this.handleRef}
            />
            <p>
              Please save somewhere this API key because we will never be able to show it again.
            </p>
          </Message.Content>
        </Message>
      )
    }
  }

  render () {
    return (
      <div>
        <Header size='small'>API key</Header>
        <Divider />
        <p>
          To fully access the API you have to use an OpenID Connect client and claim a valid access token.
          It's the <b>standard</b> way to interact with the API.<br/>
          But if you want something a bit simpler you have the possibility to use an API key.
          You only have to use this key as a basic password to acces the API.
        </p>
        <p>
          <b>Ex:</b> <code>curl {API_KEY_URL}/documents</code>
        </p>
        <p>
          An API key is not something secure. It's why you only have a <b>limited acces</b> to the API:<br/>
          You can only make <code>POST</code> or <code>GET</code> actions onto
          the <a href={`${API_ROOT}/../api-docs/#/Document`} target='_blank'>/documents API</a>.
        </p>
        <Segment>
          <Modal
            trigger={<Button primary onClick={this.handleOpen}><Icon name='refresh'/> Regenerate API key</Button>}
            open={this.state.modalOpen}
            onClose={this.handleClose}>
            <Modal.Header>Regenerate API key</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>Are you sure you want to generate a new API key?</p>
                <p>Previous key will be revoked.</p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={this.handleClose}>
                <Icon name='remove' /> No
              </Button>
              <Button color='green' onClick={this.handleGenerateApiKey}>
                <Icon name='checkmark' /> Yes
              </Button>
            </Modal.Actions>
          </Modal>
          {this.apiKey}
        </Segment>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile
})

const mapActionsToProps = (dispatch) => (bindActions({
  notification: NotificationActions,
  profile: ProfileActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(ApiKeyTab)
