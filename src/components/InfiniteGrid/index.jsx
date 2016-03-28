import React, { PropTypes } from 'react'

export default class InfiniteGrid extends React.Component {
  static propTypes = {
    size: PropTypes.string,
    hasMore: PropTypes.bool,
    loadMore: PropTypes.func.isRequired,
    children: PropTypes.node,
    threshold: PropTypes.number
  };

  static defaultProps = {
    size: 'five',
    hasMore: false,
    threshold: 50
  };

  constructor () {
    super()
    this.scrollListener = this.scrollListener.bind(this)
    this.state = {
      listening: false
    }
  }

  componentDidMount () {
    this.attachScrollListener()
  }

  componentWillUnmount () {
    this.detachScrollListener()
  }

  componentDidUpdate () {
    this.attachScrollListener()
  }

  render () {
    const {children, size} = this.props
    return (
      <div className={`ui ${size} cards`} ref='grid'>
        {children}
      </div>
    )
  }

  scrollListener () {
    const $el = this.refs.grid
    const delta = $el.parentElement.scrollHeight - $el.parentElement.scrollTop - $el.parentElement.offsetHeight
    // console.debug('scroll delta: ', delta)
    if (delta < Number(this.props.threshold)) {
      this.detachScrollListener()
      this.props.loadMore()
    }
  }

  attachScrollListener () {
    if (!this.state.listening && this.props.hasMore) {
      console.debug('attachScrollListener')
      this.setState({listening: true})
      const $el = this.refs.grid
      $el.parentElement.addEventListener('scroll', this.scrollListener)
      $el.parentElement.addEventListener('resize', this.scrollListener)
    }
  }

  detachScrollListener () {
    if (this.state.listening) {
      console.debug('detachScrollListener')
      const $el = this.refs.grid
      $el.parentElement.removeEventListener('scroll', this.scrollListener)
      $el.parentElement.removeEventListener('resize', this.scrollListener)
      this.setState({listening: false})
    }
  }
}

