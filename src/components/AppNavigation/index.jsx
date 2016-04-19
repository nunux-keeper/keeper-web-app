import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { actions as labelsActions } from 'redux/modules/labels'

export class AppNavigation extends React.Component {
  static propTypes = {
    fetchLabels: PropTypes.func.isRequired,
    labels: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  componentDidMount () {
    const { fetchLabels } = this.props
    fetchLabels()
  }

  componentDidUpdate () {
    window.$('.ui.sidebar a.item').click(() => {
      window.$('.ui.sidebar').sidebar('hide')
    })
  }

  get spinner () {
    const { isFetching } = this.props.labels
    if (isFetching) {
      return (
        <div className='ui active dimmer'>
          <div className='ui loader'></div>
        </div>
      )
    }
  }

  get labels () {
    const { labels } = this.props
    const items = this.props.labels.items.map(
      (label) => <Link
        key={`label-${label.id}`}
        to={{pathname: `/label/${label.id}`}}
        className='item'
        >
        {label.label}
        <i className='tag icon'></i>
      </Link>
    )
    if (items.length) {
      return items
    } else if (!labels.isFetching) {
      return (
        <p>No labels :(</p>
      )
    }
  }

  render () {
    const {
      location
    } = this.props

    return (
      <div>
        <Link to={{ pathname: '/' }} className='item'>
          Profile
          <i className='user icon'></i>
        </Link>
        <Link to={{ pathname: '/document' }} className='item'>
          Documents
          <i className='grid layout icon'></i>
        </Link>
        <div className='item'>
          Labels
          <div className='menu'>
            {this.labels}
            <Link
              to={{ pathname: '/label/create', state: {modal: true, returnTo: location, title: 'Create new label'} }}
              title='Create new label' className='item'>
              Create a label
              <i className='plus icon'></i>
            </Link>
          </div>
        </div>
        <Link to={{ pathname: '/' }} className='item'>
          Trash
          <i className='trash icon'></i>
        </Link>
        <Link to={{ pathname: '/' }} className='item'>
          Shares
          <i className='share alternate icon'></i>
        </Link>
        <Link to={{ pathname: '/' }} className='item'>
          Settings
          <i className='settings icon'></i>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  labels: state.labels
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, labelsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation)
