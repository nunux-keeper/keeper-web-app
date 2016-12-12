import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'

import { bindActions } from '../../store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as LabelActions } from '../../store/modules/label'
import { actions as SharingActions } from '../../store/modules/sharing'
import { actions as NotificationActions } from '../../store/modules/notification'

import AppBar from '../../components/AppBar'

const durationConfiguration = [
  { text: 'No duration', value: 'no' },
  { text: 'For 24h', value: '24h' },
  { text: 'For a week', value: '1w' },
  { text: 'For a month', value: '1m' },
  { text: 'Tomorrow', value: 't' },
  { text: 'In a week', value: 'w' },
  { text: 'Custom', value: 'custom' }
]

export class ShareLabelView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    label: PropTypes.object,
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
        startDate: '',
        endDate: '',
        pub: false,
        duration: 'no'
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this)
    this.handleChangeDatetime = this.handleChangeDatetime.bind(this)
  }

  componentDidUpdate (prevProps) {
    document.title = this.title
  }

  get title () {
    if (this.props.label.current) {
      const label = this.props.label.current
      return `Share label: ${label.label}`
    }
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

  get shareLabelForm () {
    const { startDate, endDate, pub, duration } = this.state
    const { label, sharing } = this.props
    const loading = label.isProcessing || sharing.isProcessing
    const styles = duration !== 'custom' ? {display: 'none'} : null
    return (
      <Form loading={loading} onSubmit={this.handleSubmit} >
        <Form.Select
          name='duration'
          label='Sharing duration'
          value={duration}
          options={durationConfiguration}
          onChange={this.handleChange}
        />
        <Form.Group widths='2' style={styles}>
          <Form.Input
            name='startDate'
            type='datetime-local'
            control='input'
            label='Start date'
            placeholder='Start date'
            value={startDate}
            onChange={this.handleChangeDatetime}
          />
          <Form.Input
            name='endDate'
            type='datetime-local'
            control='input'
            label='End date'
            placeholder='End date'
            value={endDate}
            onChange={this.handleChangeDatetime}
          />
        </Form.Group>
        <Form.Checkbox
          name='pub'
          label='Public'
          value='public'
          checked={pub}
          onChange={this.handleChangeCheckbox}
        />

        <Form.Group>
          <Button secondary onClick={this.handleCancel}>Cancel</Button>
          <Button primary type='submit'>Submit</Button>
        </Form.Group>
      </Form>
    )
  }

  handleSubmit (e) {
    e.preventDefault()
    const { actions, sharing } = this.props
    if (!sharing.current) {
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
      const { startDate, endDate, pub } = this.state
      actions.sharing.updateSharing({startDate, endDate, pub}).then((sharing) => {
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

  handleCancel (e) {
    e.preventDefault()
    const { actions, location: loc } = this.props
    const { state } = loc
    if (state && state.returnTo) {
      actions.router.push(state.returnTo)
    } else {
      actions.router.push('/document')
    }
    return false
  }

  handleChange (event, {name, value}) {
    this.setState({[name]: value})
  }

  handleChangeCheckbox (event, {name, checked}) {
    this.setState({[name]: checked})
  }

  handleChangeDatetime (event) {
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
  label: state.label,
  sharing: state.sharing
})

const mapActionsToProps = (dispatch) => (bindActions({
  notification: NotificationActions,
  label: LabelActions,
  sharing: SharingActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(ShareLabelView)
