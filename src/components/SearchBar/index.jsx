import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import TextField from 'material-ui/lib/text-field'
import FontIcon from 'material-ui/lib/font-icon'

// import styles from './styles.scss'

export default class SearchBar extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  };

  constructor () {
    super()
    this.handleUpdateSearchQuery = this.handleUpdateSearchQuery.bind(this)
  }

  handleUpdateSearchQuery (e) {
    if (e.keyCode === 13) {
      const { location } = this.props
      push({
        pathname: location.pathname,
        query: {
          q: e.target.value
        }
      })
    }
  }

  render () {
    const { location } = this.props
    const query = location.query.q
    return (
      <Toolbar>
        <ToolbarGroup>
          <TextField
            hintText='Search query...'
            defaultValue={query}
            onKeyDown={this.handleUpdateSearchQuery}
          />
          <FontIcon className='material-icons'>search</FontIcon>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

export default connect(mapStateToProps)(SearchBar)
