import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as LabelsActions } from 'store/modules/labels'
import { actions as SharingActions } from 'store/modules/sharing'
import { actions as NotificationActions } from 'store/modules/notification'

import AppBar from 'components/AppBar'

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
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.handlePubChange = this.handlePubChange.bind(this)
  }

  componentDidMount () {
    const $form = this.refs.form
    window.$($form)
    .form({
      on: 'blur',
      fields: {
        startDate: ['empty'],
        endDate: ['empty'],
        pub: ['empty']
      }
    })
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

  get isValid () {
    const $form = this.refs.form
    return $form && window.$($form).form('is valid')
  }

  get shareLabelForm () {
    const { startDate, endDate, pub } = this.state
    const { labels, sharing } = this.props
    const loading = labels.isProcessing || sharing.isProcessing ? 'loading' : ''
    const disabled = this.isValid ? '' : 'disabled'
    return (
      <div>
        <form className={`ui form ${loading}`} onSubmit={this.handleSubmit} ref='form'>
          <div className='field'>
            <label>Start date</label>
            <input
              required
              type='date'
              name='startDate'
              value={startDate}
              onChange={this.handleStartDateChange}
            />
          </div>
          <div className='field'>
            <label>End date</label>
            <input
              required
              type='date'
              name='endDate'
              value={endDate}
              onChange={this.handleEndDateChange}
            />
          </div>
          <div className='field'>
            <label>Public</label>
            <input
              type='checkbox'
              name='pub'
              value={pub}
              onChange={this.handlePubChange}
            />
          </div>
        </form>
        <button className={`ui right floated button primary ${disabled}`} onClick={this.handleSubmit}>
          Submit
        </button>
        <button className='ui right floated button' onClick={this.handleCancel}>
          Cancel
        </button>
      </div>
    )
  }

  handleSubmit (e) {
    e.preventDefault()
    if (!this.isValid) {
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

  handleStartDateChange (event) {
    this.setState({startDate: event.target.value})
  }

  handleEndDateChange (event) {
    this.setState({endDate: event.target.value})
  }

  handlePubChange (event) {
    this.setState({pub: event.target.value})
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='ui main'>
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
