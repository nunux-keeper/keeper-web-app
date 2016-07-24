import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { actions as labelsActions } from 'store/modules/labels'

import './styles.scss'

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
    const $el = window.$(this.refs.nav)
    $el.find('a.item').click(() => {
      $el.sidebar('hide')
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
    if (labels.isFetching || !labels.items || !labels.items.length) {
      return
    }
    return labels.items.map(
      (label) => <Link
        key={`label-${label.id}`}
        to={{pathname: `/label/${label.id}`}}
        className='item'
        >
        {label.label}
        <i className='tag icon'></i>
      </Link>
    )
  }

  render () {
    const {
      location
    } = this.props

    return (
      <div className='ui sidebar large vertical menu' id='nav' ref='nav'>
        <h2 className='ui header'>
          <i className='cloud download icon'></i>
          <span>Keeper</span>
        </h2>
        <Link to={{ pathname: '/profile' }} className='item'>
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
        <Link to={{ pathname: '/trash' }} className='item'>
          Trash
          <i className='trash icon'></i>
        </Link>
        <Link to={{ pathname: '/' }} className='item'>
          Shares
          <i className='share alternate icon'></i>
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
