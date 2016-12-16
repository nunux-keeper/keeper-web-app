import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routerActions } from 'react-router-redux'
import { Menu, Input } from 'semantic-ui-react'

export class SearchBarItem extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
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
    const {placeholder} = this.props
    return (
      <Menu.Item className='search'>
        <Input
          icon='search'
          placeholder={placeholder}
          value={this.state.q}
          onChange={this.handleChange}
          onKeyDown={this.handleUpdateSearchQuery}
        />
      </Menu.Item>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routerActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(SearchBarItem)
