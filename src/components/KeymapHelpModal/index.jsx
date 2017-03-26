/*eslint new-cap: ["error", { "newIsCap": false }]*/

import React from 'react'
import * as Mousetrap from 'mousetrap'

import { Icon, Button, Modal, Header } from 'semantic-ui-react'

import './styles.css'

export default class KeymapHelpModal extends React.Component {
  state = { isOpen: false };

  mousetrap = new Mousetrap.default();

  handleOpen = (e) => this.setState({
    isOpen: true
  });

  handleClose = (e) => this.setState({
    isOpen: false
  });

  componentDidMount () {
    this.mousetrap.bind(['?'], this.handleOpen)
  }
  componentWillUnmount () {
    this.mousetrap.unbind(['?'], this.handleOpen)
  }

  render () {
    return (
      <Modal
        open={this.state.isOpen}
        onClose={this.handleClose}
      >
        <Header icon='keyboard' content='Keyboard shortcuts' />
        <Modal.Content>
          <table className='keyboard-mappings'>
            <tbody>
              <tr>
                <th></th>
                <th>Site wide shortcuts</th>
              </tr>
              <tr>
                <td>
                  <kbd>g</kbd><kbd>d</kbd>
                </td>
                <td>Go to Documents</td>
              </tr>
              <tr>
                <td>
                  <kbd>g</kbd><kbd>t</kbd>
                </td>
                <td>Go to Trash</td>
              </tr>
              <tr>
                <td>
                  <kbd>g</kbd><kbd>r</kbd>
                </td>
                <td>Go to Sharing</td>
              </tr>
              <tr>
                <td>
                  <kbd>g</kbd><kbd>s</kbd>
                </td>
                <td>Go to Settings</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <th></th>
                <th>Documents</th>
              </tr>
              <tr>
                <td>
                  <kbd>r</kbd>
                </td>
                <td>Refresh documents</td>
              </tr>
              <tr>
                <td>
                  <kbd>o</kbd>
                </td>
                <td>Reverse sort order</td>
              </tr>
              <tr>
                <td>
                  <kbd>shift n</kbd>
                </td>
                <td>Create new empty document</td>
              </tr>
              <tr>
                <td>
                  <kbd>shift u</kbd>
                </td>
                <td>Create new document from an URL</td>
              </tr>
            </tbody>
          </table>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleClose} inverted>
            <Icon name='checkmark' /> Got it
          </Button>
        </Modal.Actions>
      </Modal>
      )
  }
}

