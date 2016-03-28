import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'

export default class SearchBar extends React.Component {
  static propTypes = {
    push: PropTypes.func,
    location: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleUpdateSearchQuery = this.handleUpdateSearchQuery.bind(this)

    const { query } = props.location
    this.state = {
      q: query ? query.q : ''
    }
  }

  handleChange (event) {
    this.setState({q: event.target.value})
  }

  handleUpdateSearchQuery (e) {
    if (e.keyCode === 13) {
      const { location } = this.props
      this.props.push({
        pathname: location.pathname,
        query: {
          q: e.target.value
        }
      })
    }
  }

  render () {
    return (
      <div className='ui icon input'>
        <input
          type='text'
          placeholder='Search...'
          value={this.state.q}
          onChange={this.handleChange}
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

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routerActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)
