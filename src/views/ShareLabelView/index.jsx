import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'

import { bindActions } from '../../store/helper'
import DateHelper from '../../helpers/DateHelper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as LabelActions } from '../../store/modules/label'
import { actions as SharingActions } from '../../store/modules/sharing'
import { actions as NotificationActions } from '../../store/modules/notification'

import AppBar from '../../components/AppBar'

const durationConfiguration = [
  { text: 'Forever', value: 'forever' },
  { text: 'For 24h', value: '24h' },
  { text: 'For a week', value: '1w' },
  { text: 'For a month', value: '1m' },
  { text: 'Tomorrow', value: 't' },
  { text: 'In a week', value: 'w' },
  { text: 'Custom', value: 'custom' }
]

const getDatesForDuration = function (duration) {
  const result = {
    startDate: null,
    endDate: null
  }
  // eslint-disable-next-line
  switch (duration) {
    case 'forever':
      result.startDate = DateHelper.build().get()
      break
    case '24h':
      result.startDate = DateHelper.build().get()
      result.endDate = DateHelper.build().addDays(1).get()
      break
    case '1w':
      result.startDate = DateHelper.build().get()
      result.endDate = DateHelper.build().addDays(7).get()
      break
    case '1m':
      result.startDate = DateHelper.build().get()
      result.endDate = DateHelper.build().addDays(30).get()
      break
    case 't':
      result.startDate = DateHelper.build().addDays(1).get()
      break
    case 'w':
      result.startDate = DateHelper.build().addDays(7).get()
      break
  }
  return result
}

const getDisplayableDate = function (date) {
  switch (true) {
    case date === null:
      return ''
    case typeof date === 'string':
      return date.split('.')[0]
    case date instanceof Date:
      return date.toISOString().split('.')[0]
    default:
      console.error('Unable to make date displayable', date)
      return ''
  }
}

export class ShareLabelView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    label: PropTypes.object,
    sharing: PropTypes.object,
    loc: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    const sharing = this.props.sharing.current
    if (sharing) {
      this.state = {
        ...sharing,
        duration: 'custom'
      }
    } else {
      this.state = {
        startDate: '',
        endDate: '',
        pub: false,
        duration: 'forever'
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChangeDuration = this.handleChangeDuration.bind(this)
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this)
    this.handleChangeDatetime = this.handleChangeDatetime.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (
      !nextProps.sharing.isFetching &&
      !nextProps.sharing.isProcessing &&
      nextProps.sharing.current
    ) {
      this.setState({
        ...nextProps.sharing.current,
        duration: 'custom'
      })
    }
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
    const routerState = this.props.loc.state
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
          onChange={this.handleChangeDuration}
        />
        <Form.Group widths='2' style={styles}>
          <Form.Input
            name='startDate'
            type='datetime-local'
            control='input'
            label='Start date'
            placeholder='Start date'
            value={getDisplayableDate(startDate)}
            onChange={this.handleChangeDatetime}
          />
          <Form.Input
            name='endDate'
            type='datetime-local'
            control='input'
            label='End date'
            placeholder='End date'
            value={getDisplayableDate(endDate)}
            onChange={this.handleChangeDatetime}
          />
        </Form.Group>
        <Form.Field>
          <label>Sharing options</label>
          <Form.Group inline>
            <Form.Checkbox
              name='pub'
              label='Public'
              value='public'
              checked={pub}
              onChange={this.handleChangeCheckbox}
            />
          </Form.Group>
        </Form.Field>

        <Form.Group>
          <Button secondary onClick={this.handleCancel}>Cancel</Button>
          <Button primary type='submit'>Submit</Button>
        </Form.Group>
      </Form>
    )
  }

  handleSubmit (e) {
    e.preventDefault()
    const { actions, sharing, loc } = this.props
    if (!sharing.current) {
      const { startDate, endDate, pub } = this.state
      actions.sharing.createSharing({startDate, endDate, pub}).then((sharing) => {
        const { state } = loc
        if (state && state.returnTo) {
          actions.router.push(state.returnTo)
        } else {
          actions.router.push(`/label/${sharing.targetLabel}`)
        }
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
        const { state } = loc
        if (state && state.returnTo) {
          actions.router.push(state.returnTo)
        } else {
          actions.router.push(`/label/${sharing.targetLabel}`)
        }
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
    const { actions, loc } = this.props
    const { state } = loc
    if (state && state.returnTo) {
      actions.router.push(state.returnTo)
    } else {
      actions.router.push('/document')
    }
    return false
  }

  handleChangeDuration (event, {name, value}) {
    const update = (value !== 'custom') ? getDatesForDuration(value) : {}
    update[name] = value
    this.setState(update)
  }

  handleChangeCheckbox (event, {name, checked}) {
    this.setState({[name]: checked})
  }

  handleChangeDatetime (event) {
    let value = event.target.value
    if (value && value !== '') {
      value = new Date(value.replace(/-/g, '/').replace('T', ' '))
    } else {
      value = null
    }

    this.setState({[event.target.name]: value})
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
  loc: state.router.locationBeforeTransitions,
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
