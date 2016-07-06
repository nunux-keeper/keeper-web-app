import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'
import { actions as labelsActions } from 'store/modules/labels'
import { actions as notificationActions } from 'store/modules/notification'
import ColorSwatch from 'components/ColorSwatch'
import AppBar from 'components/AppBar'

export class LabelView extends React.Component {
  static propTypes = {
    labels: PropTypes.object,
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
        label: '',
        color: '#8E44AD'
      }
    } else {
      this.state = {...props.labels.current}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleLabelChange = this.handleLabelChange.bind(this)
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
    const { current } = this.props.labels
    return (
      <AppBar
        modal={this.isModalDisplayed}
        title={this.isCreateForm ? 'New label' : `Edit label: ${current.label}`}
      />
    )
  }

  get labelForm () {
    const { color, label } = this.state
    const { isProcessing } = this.props.labels
    const loading = isProcessing ? 'loading' : ''
    return (
      <div>
        <form className={`ui form ${loading}`} onSubmit={this.handleSubmit}>
          <div className='field'>
            <label>Label name</label>
            <input
              required
              type='text'
              name='label-value'
              placeholder='Label Name'
              value={label}
              onChange={this.handleLabelChange}
            />
          </div>
          <div className='field'>
            <label>Color value</label>
            <input
              disabled
              type='text'
              name='color-value'
              placeholder='Color value'
              value={color}
            />
            <ColorSwatch value={color} onColorChange={this.handleColorChange} />
          </div>
        </form>
        <button className='ui right floated primary button' onClick={this.handleSubmit}>
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
    const { createLabel, updateLabel, showNotification } = this.props
    if (this.isCreateForm) {
      createLabel(this.state).then((label) => {
        this.props.push(`/label/${label.id}`)
        showNotification({message: 'Label created'})
      }).catch((err) => {
        showNotification({
          header: 'Unable to create label',
          message: err.error,
          level: 'error'
        })
      })
    } else {
      const { current } = this.props.labels
      updateLabel(current, this.state).then((label) => {
        this.props.push(`/label/${label.id}`)
        showNotification({message: 'Label updated'})
      }).catch((err) => {
        showNotification({
          header: 'Unable to update label',
          message: err.error,
          level: 'error'
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

  handleLabelChange (event) {
    this.setState({label: event.target.value})
  }

  handleColorChange (color) {
    this.setState({color: color})
  }

  render () {
    return (
      <div className='view'>
        {this.header}
        <div className='ui main'>
          {this.labelForm}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  labels: state.labels
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign(
    {},
    notificationActions,
    labelsActions,
    routerActions
  ), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(LabelView)
