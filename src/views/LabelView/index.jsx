import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as LabelActions } from 'store/modules/label'
import { actions as NotificationActions } from 'store/modules/notification'

import ColorSwatch from 'components/ColorSwatch'
import AppBar from 'components/AppBar'

export class LabelView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    label: PropTypes.object,
    location: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    if (this.isCreateForm) {
      this.state = {
        label: '',
        color: '#8E44AD'
      }
    } else {
      this.state = {...props.label.current}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleColorChoose = this.handleColorChoose.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (
      !nextProps.label.isFetching &&
      !nextProps.label.isProcessing &&
      nextProps.label.current
    ) {
      this.setState(nextProps.label.current)
    }
  }

  componentDidUpdate (prevProps) {
    document.title = this.title
  }

  get title () {
    if (this.isCreateForm) {
      return 'New label'
    } else if (this.props.label.current) {
      const { current: {label} } = this.props.label
      return `Edit label: ${label}`
    }
  }

  get isCreateForm () {
    const pathname = this.props.location.pathname
    return pathname === '/label/create'
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

  get isValidLabel () {
    const { label } = this.state
    return label !== ''
  }

  get labelForm () {
    const { color, label } = this.state
    const { isProcessing } = this.props.label
    const loading = isProcessing
    const disabled = !this.isValidLabel
    return (
      <Form loading={loading} onSubmit={this.handleSubmit} >
        <Form.Input
          name='label'
          type='text'
          control='input'
          label='Label name'
          placeholder='Label Name'
          value={label}
          onChange={this.handleChange}
          error={!this.isValidLabel}
          required
        />
        <Form.Field>
          <label>Color value</label>
          <input
            name='color'
            type='color'
            value={color}
            onChange={this.handleChange}
            required
          />
          <ColorSwatch value={color} onColorChange={this.handleColorChoose} />
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
    if (!this.isValidLabel) {
      return false
    }
    const { actions } = this.props
    if (this.isCreateForm) {
      actions.label.createLabel(this.state).then((label) => {
        actions.router.push(`/label/${label.id}`)
        actions.notification.showNotification({message: 'Label created'})
      }).catch((err) => {
        actions.notification.showNotification({
          header: 'Unable to create label',
          message: err.error,
          level: 'error'
        })
      })
    } else {
      const { current } = this.props.label
      actions.label.updateLabel(current, this.state).then((label) => {
        actions.router.push(`/label/${label.id}`)
        actions.notification.showNotification({message: 'Label updated'})
      }).catch((err) => {
        actions.notification.showNotification({
          header: 'Unable to update label',
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

  handleChange (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleColorChoose (color) {
    this.setState({color})
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='viewContent'>
          {this.labelForm}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  label: state.label
})

const mapActionsToProps = (dispatch) => (bindActions({
  notification: NotificationActions,
  label: LabelActions,
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(LabelView)
