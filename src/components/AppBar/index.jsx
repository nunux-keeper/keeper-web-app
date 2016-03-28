import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

export class AppBar extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    contextMenu: PropTypes.node,
    title: PropTypes.string.isRequired,
    styles: PropTypes.object
  };

  constructor () {
    super()
    this.handleMenuClick = this.handleMenuClick.bind(this)
  }

  componentDidMount () {
    window.jQuery('.dropdown').dropdown({
      transition: 'drop'
    })
  }

  handleMenuClick () {
    window.$('.ui.sidebar').sidebar({
      context: window.$('#main')
    }).sidebar('toggle')
  }

  render () {
    const { children, contextMenu, styles, title } = this.props
    return (
      <div className='ui top inverted menu' style={styles}>
        <a className='item' onClick={this.handleMenuClick}>
          <i className='sidebar icon'></i>
        </a>
        <div className='header item'>{title}</div>
        <div className='right menu'>
          {children}
          <div className='ui dropdown icon right item'>
            <i className='ellipsis vertical icon'></i>
            {contextMenu}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  label: state.label
})

export default connect(mapStateToProps)(AppBar)
