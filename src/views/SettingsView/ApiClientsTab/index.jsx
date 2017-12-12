import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router'
import { bindActions } from 'store/helper'
import ClientActions from 'store/client/actions'
import ClientsActions from 'store/clients/actions'

import { actions as NotificationActions } from 'store/modules/notification'

import { Table, Icon, Button, Header, Divider, Dimmer, Loader, Modal } from 'semantic-ui-react'
import AppSignPanel from 'components/AppSignPanel'

const API_ROOT = process.env.REACT_APP_API_ROOT

class ApiClientsTab extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    loc: PropTypes.object.isRequired,
    clients: PropTypes.object
  };

  constructor (props) {
    super(props)
    this.state = {
      clientToDelete: null
    }
  }

  componentDidMount () {
    const { actions } = this.props
    actions.clients.fetchClients()
  }

  handleDeleteClient = () => {
    const { actions } = this.props
    const { clientToDelete } = this.state
    actions.client.removeClient(clientToDelete).then(() => {
      this.setState({ clientToDelete: null })
      actions.notification.showNotification({message: 'Client removed'})
    }, err => {
      this.setState({ clientToDelete: null })
      actions.notification.showNotification({
        header: 'Unable to remove client',
        message: err.error,
        level: 'error'
      })
    })
  };

  renderRowButtons (client) {
    const askDeleteClient = () => this.setState({ clientToDelete: client })
    const { loc } = this.props
    return (
      <div>
        <Button
          compact
          negative
          icon='remove'
          content='delete'
          onClick={askDeleteClient}
        />
        <Button as={Link}
          compact
          icon='edit'
          content='edit'
          to={{pathname: `/settings/clients/${client.id}`, state: {modal: true, returnTo: loc}}}
        />
      </div>
    )
  }

  renderRow (client) {
    return (
      <Table.Row key={`whk-${client.id}`}>
        <Table.Cell>
          {client.name}
        </Table.Cell>
        <Table.Cell>
          {client.cdate}
        </Table.Cell>
        <Table.Cell>
          {client.clientId}
        </Table.Cell>
        <Table.Cell collapsing textAlign='center'>
          {this.renderRowButtons(client)}
        </Table.Cell>
      </Table.Row>
    )
  }

  get rows () {
    const { current } = this.props.clients
    if (current && current.clients && current.clients.length) {
      return current.clients.map(item => this.renderRow(item))
    } else {
      return (
        <Table.Row disabled>
          <Table.Cell colSpan='4'>No API client</Table.Cell>
        </Table.Row>
      )
    }
  }

  get tableHeader () {
    const { current } = this.props.clients
    if (current && current.clients && current.clients.length) {
      return (
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Creation date</Table.HeaderCell>
            <Table.HeaderCell>ID client</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        )
    }
    return null
  }

  get table () {
    const { error } = this.props.clients
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
          {this.tableHeader}
          <Table.Body>
            {this.rows}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan='4'>
                <Button
                  as={Link}
                  primary
                  size='small'
                  icon='plus'
                  content='Add client'
                  labelPosition='left'
                  to={{pathname: '/settings/clients/create', state: {modal: true, returnTo: loc}}}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )
    }
  }

  get modal () {
    const open = this.state.clientToDelete !== null
    const handleClose = () => this.setState({ clientToDelete: null })

    return (
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Modal.Header>Delete API client</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Are you sure to delete this API client?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button negative content='no' onClick={handleClose} />
          <Button positive content='yes' onClick={this.handleDeleteClient} />
        </Modal.Actions>
      </Modal>
    )
  }

  render () {
    const { isProcessing } = this.props.clients
    return (
      <div>
        <Header size='small'>API clients</Header>
        <Divider />
        <p>
          To fully access the <a href={`${API_ROOT}/../api-docs/`} target='_blank'>API</a> you
          have to use an OpenID Connect client and claim a valid access token.
          Use this screen to configure your client app credentials.
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
  clients: state.clients
})

const mapActionsToProps = (dispatch) => (bindActions({
  client: ClientActions,
  clients: ClientsActions,
  notification: NotificationActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(ApiClientsTab)
