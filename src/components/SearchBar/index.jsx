import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

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
      <div className='ui icon input'>
        <input
          type='text'
          placeholder='Search...'
          value={query}
          onKeyDown={this.handleUpdateSearchQuery}
        />
        <i className='search link icon'></i>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

export default connect(mapStateToProps)(SearchBar)
