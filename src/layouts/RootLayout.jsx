import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as layoutActions } from 'store/modules/layout'

export class RootLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    resize: PropTypes.func
  };

  componentDidMount () {
    const { resize } = this.props
    window.addEventListener('resize', resize)
  }

  componentWillUnmount () {
    const { resize } = this.props
    window.removeEventListener('resize', resize)
  }

  render () {
    return (this.props.children)
  }
}

export default connect(null, layoutActions)(RootLayout)

