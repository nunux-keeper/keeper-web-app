/*eslint new-cap: ["error", { "newIsCap": false }]*/

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { routerActions as RouterActions } from 'react-router-redux'
import * as Mousetrap from 'mousetrap'

import { bindActions } from 'store/helper'

export class AppKeyboardHandlers extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    actions: PropTypes.object.isRequired
  };

  mousetrap = new Mousetrap.default();

  goto = (pathname) => this.props.actions.router.push({pathname});

  gotoDocuments = (e) => this.goto('/documents');
  gotoTrash = (e) => this.goto('/trash');
  gotoSharing = (e) => this.goto('/sharing');
  gotoSettings = (e) => this.goto('/settings');
  gotoAbout = (e) => this.goto('/about');

  componentDidMount () {
    this.mousetrap.bind(['g d'], this.gotoDocuments)
    this.mousetrap.bind(['g t'], this.gotoTrash)
    this.mousetrap.bind(['g r'], this.gotoSharing)
    this.mousetrap.bind(['g s'], this.gotoSettings)
    this.mousetrap.bind(['g a'], this.gotoAbout)
  }

  componentWillUnmount () {
    this.mousetrap.unbind(['g d'], this.gotoDocuments)
    this.mousetrap.unbind(['g t'], this.gotoTrash)
    this.mousetrap.unbind(['g r'], this.gotoSharing)
    this.mousetrap.unbind(['g s'], this.gotoSettings)
    this.mousetrap.unbind(['g a'], this.gotoAbout)
  }

  render () {
    return (this.props.children)
  }
}

const mapActionsToProps = (dispatch) => (bindActions({
  router: RouterActions
}, dispatch))

export default connect(null, mapActionsToProps)(AppKeyboardHandlers)

