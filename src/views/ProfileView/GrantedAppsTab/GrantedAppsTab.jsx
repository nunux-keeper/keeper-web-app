import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'

import { actions as appsActions } from 'redux/modules/apps'

export class GrantedAppsTab extends React.Component {
  static propTypes = {
    apps: PropTypes.object.isRequired,
    fetchApps: PropTypes.func
  };

  componentDidMount () {
    this.props.fetchApps()
  }

  get spinner () {
    const { isFetching } = this.props.apps
    if (isFetching) {
      return (
        <div className='ui active centered inline loader' />
      )
    }
  }

  get noApps () {
    const { isFetching, items } = this.props.apps
    if (!isFetching && items.length === 0) {
      return (
        <p>You have no application granted to access your account.</p>
      )
    }
  }

  get apps () {
    const { isFetching, items } = this.props.apps
    if (!isFetching && items.length > 0) {
      const $li = items.map(
        (app) => <li key={`app-${app._id}`}>
          <a href={app.homepage} target='_blank'>{app.name}</a>
        </li>
      )
      return (
        <div>
          <p>You have {items.length} application(s) granted to access your account:</p>
          <ul>{$li}</ul>
        </div>
      )
    }
  }

  render () {
    return (
      <div>
        {this.spinner}
        {this.noApps}
        {this.apps}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  apps: state.apps
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, appsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(GrantedAppsTab)

