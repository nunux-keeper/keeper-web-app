import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Dimmer, Loader, Icon, Table, Label, Button } from 'semantic-ui-react'

import { bindActions } from 'store/helper'

import { actions as SharingActions } from 'store/modules/sharing'
import { actions as NotificationActions } from 'store/modules/notification'

import AppBar from 'components/AppBar'
import AppSignPanel from 'components/AppSignPanel'

import * as NProgress from 'nprogress'

export class SharingListView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    loc: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    sharing: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.title = 'All sharing'
    document.title = this.title
  }

  componentDidUpdate (prevProps) {
    const {isProcessing} = this.props.sharing
    const {isProcessing: wasProcessing} = prevProps.sharing
    if (!wasProcessing && isProcessing) {
      NProgress.start()
    } else if (wasProcessing && !isProcessing) {
      NProgress.done()
    }
  }

  get header () {
    const { sharing } = this.props
    const total = sharing.items ? sharing.items.length : 0
    const $totalSharing = <small>[{total}]</small>
    const $title = <span><Icon name='share alternate' />{this.title} {$totalSharing}</span>

    return (
      <AppBar title={$title} />
    )
  }

  getRowDurationLabel (sharing) {
    const d = {
      start: {
        date: new Date(sharing.startDate)
      },
      end: {
        date: sharing.endDate ? new Date(sharing.endDate) : null,
        iso: '',
        loc: ''
      }
    }
    d.start.iso = d.start.date.toISOString()
    d.start.loc = d.start.date.toLocaleString()
    if (d.end.date) {
      d.end.iso = d.end.date.toISOString()
      d.end.loc = d.end.date.toLocaleString()
    }

    let $duration = <div>from <time dateTime={d.start.iso}>{d.start.loc}</time> to <time dateTime={d.end.iso}>{d.end.loc}</time></div>
    switch (true) {
      case d.end.date && d.end.date < new Date():
        $duration = <div><Icon name='attention' /> outdated</div>
        break
      case d.start.date < new Date():
        if (d.end.date) {
          $duration = <div>until <time dateTime={d.end.iso}>{d.end.loc}</time></div>
        } else {
          $duration = <div>forever</div>
        }
        break
      case d.start.date > new Date():
        if (!d.end.date) {
          $duration = <div>after <time dateTime={d.start.iso}>{d.start.loc}</time></div>
        }
        break
      default:
        $duration = <div>undefined</div>
    }
    return $duration
  }

  getRowLinks (sharing, label) {
    if (!label) {
      return <div><Icon name='attention' /> missing label</div>
    }
    const outdated = sharing.endDate && new Date(sharing.endDate) < new Date()
    let $sharingPage = null
    if (!outdated) {
      $sharingPage = <Label as={Link} to={{pathname: `/sharing/${sharing.id}`}} title='View sharing page'>
        <Icon name='linkify' />
        Sharing page
      </Label>
    }
    let $publicPage = null
    if (sharing.pub && !outdated) {
      $publicPage = <Label as={Link} to={{pathname: `/pub/${sharing.id}`}} title='View public page'>
        <i className='icons'>
          <i className='world icon'></i>
          <i className='corner linkify icon'></i>
        </i>
        Public page
      </Label>
    }
    return (
      <div>
        <Label as={Link} to={{pathname: `/labels/${label.id}`}} title='View label page'>
          <Icon name='circle' style={{ color: label.color }} />{label.label}
        </Label>
        { $sharingPage }
        { $publicPage }
      </div>
    )
  }

  getRowButtons (sharing, label) {
    if (!label) {
      return <b>-</b>
    }
    const { loc } = this.props
    return (
      <div>
        <Button
          compact
          icon='remove'
          content='delete'
          onClick={() => this.handleDeleteSharing(sharing)}
        />
        <Button as={Link}
          compact
          icon='edit'
          content='edit'
          to={{pathname: `/labels/${sharing.targetLabel}/share`, state: {modal: true, returnTo: loc, title: `Share label: ${label.label}`}}}
        />
      </div>
    )
  }

  getRow (sharing) {
    const { labels } = this.props
    const l = labels.items.find((l) => l.id === sharing.targetLabel)
    const $pub = sharing.pub ? <Icon color='green' name='checkmark' size='large' /> : null
    const error = !l
    const outdated = sharing.endDate && new Date(sharing.endDate) < new Date()
    return (
      <Table.Row key={`sharing-${sharing.id}`} warning={outdated} error={error}>
        <Table.Cell>
          {this.getRowLinks(sharing, l)}
        </Table.Cell>
        <Table.Cell>
          {this.getRowDurationLabel(sharing)}
        </Table.Cell>
        <Table.Cell textAlign='center'>{$pub}</Table.Cell>
        <Table.Cell collapsing textAlign='center'>
          {this.getRowButtons(sharing, l)}
        </Table.Cell>
      </Table.Row>
    )
  }

  get sharingList () {
    const { isFetching, items, error } = this.props.sharing
    if (error) {
      return (
        <AppSignPanel level='error'>
          <Icon name='bug' />
          {error.error || 'An error occurred!'}
        </AppSignPanel>
      )
    } else if (!isFetching && items.length === 0) {
      return (
        <AppSignPanel>
          <Icon name='share alternate' />
          No sharing.
        </AppSignPanel>
      )
    } else {
      const $rows = items.map((sharing) => this.getRow(sharing))
      return (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Links</Table.HeaderCell>
              <Table.HeaderCell>Duration</Table.HeaderCell>
              <Table.HeaderCell>Public</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {$rows}
          </Table.Body>
        </Table>
      )
    }
  }

  render () {
    const { isFetching } = this.props.sharing
    return (
      <div className='view'>
        {this.header}
        <Dimmer.Dimmable dimmed={isFetching} className='viewContent sharing' >
          <Dimmer active={isFetching} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
          {this.sharingList}
        </Dimmer.Dimmable>
      </div>
    )
  }

  handleDeleteSharing (sharing) {
    const { actions } = this.props
    actions.sharing.removeSharing(sharing).then((sharing) => {
      actions.notification.showNotification({message: 'Sharing removed'})
    }).catch((err) => {
      actions.notification.showNotification({
        header: 'Unable to remove sharing',
        message: err.error,
        level: 'error'
      })
    })
  }
}

const mapStateToProps = (state) => ({
  loc: state.router.locationBeforeTransitions,
  labels: state.labels,
  sharing: state.sharing
})

const mapActionsToProps = (dispatch) => (bindActions({
  sharing: SharingActions,
  notification: NotificationActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(SharingListView)
