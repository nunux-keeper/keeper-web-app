import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Button, Checkbox } from 'semantic-ui-react'

import { bindActions } from '../../store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as LabelsActions } from '../../store/modules/labels'
import { actions as SharingActions } from '../../store/modules/sharing'
import { actions as NotificationActions } from '../../store/modules/notification'

import AppBar from '../../components/AppBar'

export class ShareLabelView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    labels: PropTypes.object,
    sharing: PropTypes.object,
    location: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    const sharing = this.props.sharing.current
    if (sharing) {
      this.state = {...sharing}
    } else {
      this.state = {
        startDate: new Date(),
        endDate: null,
        pub: false
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidUpdate (prevProps) {
    document.title = this.title
  }

  get title () {
    const label = this.props.labels.current
    return `Share label: ${label.label}`
  }

  get isModalDisplayed () {
    const routerState = this.props.location.state
    return routerState && routerState.modal
  }

  get header () {
    return (
      <AppBar
        modal={this.isModalDisplayed}
        title={this.title}
      />
    )
  }

  get isValidStartDate () {
    const { startDate } = this.state
    return startDate !== ''
  }

  get isValidEndDate () {
    const { endDate } = this.state
    return endDate !== ''
  }

  get isValidForm () {
    return this.isValidStartDate && this.isValidEndDate
  }

  get shareLabelForm () {
    const { startDate, endDate, pub } = this.state
    const { labels, sharing } = this.props
    const loading = labels.isProcessing || sharing.isProcessing
    const disabled = !this.isValidForm
    return (
      <Form loading={loading} onSubmit={this.handleSubmit} >
        <Form.Input
          name='startDate'
          type='datetime'
          control='input'
          label='Start date'
          placeholder='Start date'
          value={startDate}
          onChange={this.handleChange}
          error={!this.isValidStartDate}
          required
        />
        <Form.Input
          name='endDate'
          type='datetime'
          control='input'
          label='End date'
          placeholder='End date'
          value={endDate}
          onChange={this.handleChange}
          error={!this.isValidEndDate}
          required
        />
        <Form.Field>
          <label>Public</label>
          <Checkbox
            name='pub'
            value={pub}
            onChange={this.handleChange}
            toggle
          />
        </Form.Field>

        <Form.Group>
          <Button secondary onClick={this.handleCancel}>Cancel</Button>
          <Button primary type='submit' disabled={disabled}>Submit</Button>
        </Form.Group>
      </Form>
    )
  }

  handleSubmit (e) {
    e.preventDefault()
    if (!this.isValidForm) {
      return false
    }
    const { actions, sharing } = this.props
    if (sharing.current) {
      actions.sharing.createSharing(this.state).then((sharing) => {
        actions.router.push(`/label/${sharing.targetLabel}`)
        actions.notification.showNotification({message: 'Label shared'})
      }).catch((err) => {
        actions.notification.showNotification({
          header: 'Unable to share label',
          message: err.error,
          level: 'error'
        })
      })
    } else {
      actions.sharing.updateSharing(this.state).then((sharing) => {
        actions.router.push(`/label/${sharing.targetLabel}`)
        actions.notification.showNotification({message: 'Label sharing updated'})
      }).catch((err) => {
        actions.notification.showNotification({
          header: 'Unable to update label sharing',
          message: err.error,
          level: 'error'
        })
      })
    }
    return false
  }

  handleCancel () {
    const { actions, location: loc } = this.props
    const { state } = loc
    if (state && state.returnTo) {
      actions.router.push(state.returnTo)
    } else {
      actions.router.push('/document')
    }
  }

  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='viewContent'>
          {this.shareLabelForm}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  labels: state.labels,
  sharing: state.labels
})

const mapActionsToProps = (dispatch) => (bindActions({
  notification: NotificationActions,
  labels: LabelsActions,
  sharing: SharingActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(ShareLabelView)
