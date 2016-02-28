import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routeActions } from 'react-router-redux'

import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import TextField from 'material-ui/lib/text-field'
import FontIcon from 'material-ui/lib/font-icon'

// import styles from './styles.scss'

export default class SearchBar extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired
  };

  handleUpdateSearchQuery (q) {
    const { push, location } = this.props
    push({
      pathname: location.pathname,
      query: {
        q: q
      }
    })
  }

  render () {
    const { location } = this.props
    const query = location.query.q
    return (
      <Toolbar>
        <ToolbarGroup>
          <TextField
            hintText='Search query...'
            defaultValue={ query }
            onEnterKeyDown={ (e) => this.handleUpdateSearchQuery(e.target.value) }
          />
          <FontIcon className='material-icons'>search</FontIcon>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.routing.location
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routeActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)
