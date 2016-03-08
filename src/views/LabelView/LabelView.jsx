import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routeActions } from 'react-router-redux'
import { actions as labelActions } from 'redux/modules/label'
import { actions as navigationActions } from 'redux/modules/navigation'
import { actions as notificationActions } from 'redux/modules/notification'
import ColorSwatch from 'components/ColorSwatch'

import AppBar from 'material-ui/lib/app-bar'
import CircularProgress from 'material-ui/lib/circular-progress'
import Divider from 'material-ui/lib/divider'
import FlatButton from 'material-ui/lib/flat-button'
import TextField from 'material-ui/lib/text-field'

import styles from './styles.scss'

export class LabelView extends React.Component {
  static propTypes = {
    label: PropTypes.object,
    createLabel: PropTypes.func.isRequired,
    updateLabel: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    toggleNavigation: PropTypes.func,
    push: PropTypes.func
  };

  constructor (props) {
    super(props)
    if (this.isCreateForm) {
      this.state = {
        label: 'my new label',
        color: '#8E44AD'
      }
    } else {
      this.state = {...props.label.value}
    }
    this.handleNavBarTouch = this.handleNavBarTouch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleLabelChange = this.handleLabelChange.bind(this)
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
        <AppBar
          title={label.value ? label.value.label : 'New label'}
          className='appBar'
          onLeftIconButtonTouchTap={this.handleNavBarTouch}
        />
      )
    }
  }

  get spinner () {
    const { isProcessing } = this.props.label
    if (isProcessing) {
      return (
        <div><CircularProgress /></div>
      )
    }
  }

  get labelForm () {
    const {label, color} = this.state
    let errorText = null
    if (label.trim() === '') {
      errorText = 'This field is required'
    }
    return (
      <form className={styles.labelForm} onSubmit={this.handleSubmit}>
        <TextField
          floatingLabelText='Label'
          value={label}
          errorText={errorText}
          onChange={this.handleLabelChange}
        />
        <br />
        <TextField disabled floatingLabelText='Color' value={color}/>
        <ColorSwatch value={color} onColorChange={this.handleColorChange} />
        <Divider />
        <div className={styles.actionsForm}>
          <FlatButton
            secondary
            label='Cancel'
            onTouchTap={this.handleCancel}/>
          <FlatButton
            primary
            label='Submit'
            disabled={errorText !== null}
            onTouchTap={this.handleSubmit}
          />
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

  handleLabelChange (e) {
    this.setState({label: e.target.value})
  }

  handleColorChange (color) {
    this.setState({color: color})
  }

  handleNavBarTouch () {
    const { toggleNavigation } = this.props
    toggleNavigation()
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
    navigationActions,
    notificationActions,
    labelActions,
    routeActions
  ), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(LabelView)
