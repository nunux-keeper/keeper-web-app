import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Events from 'material-ui/lib/utils/events'
import { actions as deviceActions } from 'redux/modules/device'

export class RootLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    resize: PropTypes.func
  };

  componentDidMount () {
    const { resize } = this.props
    Events.on(window, 'resize', resize)
  }

  componentWillUnmount () {
    const { resize } = this.props
    Events.off(window, 'resize', resize)
  }

  render () {
    return (this.props.children)
  }
}

export default connect(null, deviceActions)(RootLayout)

