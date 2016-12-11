import React, { PropTypes } from 'react'

import './styles.css'

export default class AppSignPanel extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    level: PropTypes.string
  };

  static defaultProps = {
    level: 'info'
  };

  get titleClassName () {
    const { level } = this.props
    return (level === 'error' || level === 'warn') ? 'inverted' : 'normal'
  }

  render () {
    const { children, level } = this.props
    return (
      <div className={level} id='AppSignPanel'>
        <div className='content'>
          <div className='center'>
            <h2 className={`ui icon ${this.titleClassName} header`}>
              {children}
            </h2>
          </div>
        </div>
      </div>
    )
  }
}

