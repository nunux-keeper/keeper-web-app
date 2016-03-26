import React, { PropTypes } from 'react'

function topPosition ($el) {
  if (!$el) {
    return 0
  }
  return $el.offsetTop + topPosition($el.offsetParent)
}

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
    threshold: 20
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
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
    if (topPosition($el) + $el.offsetHeight - scrollTop - window.innerHeight < Number(this.props.threshold)) {
      this.detachScrollListener()
      this.props.loadMore()
    }
  }

  attachScrollListener () {
    if (!this.state.listening && this.props.hasMore) {
      console.debug('attachScrollListener')
      this.setState({listening: true})
      window.addEventListener('scroll', this.scrollListener)
      window.addEventListener('resize', this.scrollListener)
    }
  }

  detachScrollListener () {
    if (this.state.listening) {
      console.debug('detachScrollListener')
      window.removeEventListener('scroll', this.scrollListener)
      window.removeEventListener('resize', this.scrollListener)
      this.setState({listening: false})
    }
  }
}

