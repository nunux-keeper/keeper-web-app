import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routeActions } from 'react-router-redux'
import { actions as labelActions } from 'redux/modules/label'
import { actions as notificationActions } from 'redux/modules/notification'
import ColorSwatch from 'components/ColorSwatch'
import AppBar from 'components/AppBar'

export class LabelView extends React.Component {
  static propTypes = {
    label: PropTypes.object,
    createLabel: PropTypes.func.isRequired,
    updateLabel: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func
  };

  constructor (props) {
    super(props)
    if (this.isCreateForm) {
      this.state = {
        color: '#8E44AD'
      }
    } else {
      this.state = {...props.label.value}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
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
    if (!this.isModalDisplayed) {
      const { label } = this.props
      return (
        <AppBar title={label.value ? label.value.label : 'New label'} />
      )
    }
  }

  get spinner () {
    const { isProcessing } = this.props.label
    if (isProcessing) {
      return (
        <div className='ui active dimmer'>
          <div className='ui large text loader'>Loading</div>
        </div>
      )
    }
  }

  get labelForm () {
    const {color} = this.state
    return (
      <form className='ui form' onSubmit={this.handleSubmit}>
        <div className='field'>
          <label>Label name</label>
          <input type='text' name='label-name' placeholder='Label Name' />
        </div>
        <div className='field'>
          <label>Color value</label>
          <input type='text' name='color-value' placeholder='Color value' value={color} disabled />
          <ColorSwatch value={color} onColorChange={this.handleColorChange} />
        </div>
      </form>
    )
  }

  handleSubmit (e) {
    e.preventDefault()
    const { createLabel, updateLabel, showNotification } = this.props
    if (this.isCreateForm) {
      createLabel(this.state).then((debug) => {
        const { label } = this.props
        setTimeout(() => {
          this.props.push(`/label/${label.value.id}`)
        }, 100)
        showNotification({
          message: 'Label created'
        })
      })
    } else {
      updateLabel(this.state).then((debug) => {
        const { label } = this.props
        this.props.push(`/label/${label.value.id}`)
        showNotification({
          message: 'Label updated'
        })
      })
    }
  }

  handleCancel () {
    const { state } = this.props.location
    if (state && state.returnTo) {
      this.props.push(state.returnTo)
    } else {
      this.props.push('/document')
    }
  }

  handleColorChange (color) {
    this.setState({color: color})
  }

  render () {
    return (
      <div>
        {this.header}
        {this.spinner}
        {this.labelForm}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  label: state.label
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign(
    {},
    notificationActions,
    labelActions,
    routeActions
  ), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(LabelView)
