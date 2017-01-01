import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Dimmer, Loader, Icon, Table, Label } from 'semantic-ui-react'

import { bindActions } from 'store/helper'

import { actions as SharingActions } from 'store/modules/sharing'

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

  getDurationLabel (sharing) {
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
      case d.end.date < new Date():
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

  getRow (sharing) {
    const { labels, loc } = this.props
    const l = labels.items.find((l) => l.id === sharing.targetLabel)
    const color = l ? {color: l.color} : {}
    const $label = l
      ? <Label as={Link} to={{pathname: `/label/${l.id}`}} ><Icon name='circle' style={color} />{l.label}</Label>
      : <div><Icon name='attention' /> missing label</div>
    const $pub = sharing.pub ? <Icon color='green' name='checkmark' size='large' /> : null
    const error = !l
    const warning = sharing.endDate && new Date(sharing.endDate) < new Date()
    const $link = l
      ? <Link to={{pathname: `/label/${l.id}/share`, state: {modal: true, returnTo: loc, title: `Share label: ${l.label}`}}}>edit</Link>
      : null
    return (
      <Table.Row key={`sharing-${sharing.id}`} warning={warning} error={error}>
        <Table.Cell>
          {$label}
        </Table.Cell>
        <Table.Cell>
          {this.getDurationLabel(sharing)}
        </Table.Cell>
        <Table.Cell textAlign='center'>{$pub}</Table.Cell>
        <Table.Cell selectable textAlign='center'>
          {$link}
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
          An error occurred!
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
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>Duration</Table.HeaderCell>
              <Table.HeaderCell>Public</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>-</Table.HeaderCell>
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
}

const mapStateToProps = (state) => ({
  loc: state.router.locationBeforeTransitions,
  labels: state.labels,
  sharing: state.sharing
})

const mapActionsToProps = (dispatch) => (bindActions({
  sharing: SharingActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(SharingListView)
