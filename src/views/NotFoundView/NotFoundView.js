import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { actions as titleActions } from '../../redux/modules/title'

export class NotFoundView extends React.Component {
  static propTypes = {
    updateTitle: PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.updateTitle()
  }

  render () {
    return (
      <div className='container text-center'>
        <h1>This is a demo 404 page!</h1>
        <hr />
        <Link to='/'>Back To Home View</Link>
      </div>
    )
  }
}

export default connect(null, titleActions)(NotFoundView)
