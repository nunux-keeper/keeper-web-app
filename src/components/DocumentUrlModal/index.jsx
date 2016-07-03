import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { routerActions } from 'react-router-redux'
import { actions as urlModalActions } from 'store/modules/urlModal'

export class DocumentUrlModal extends React.Component {
  static propTypes = {
    hideUrlModal: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = { url: '' }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.show && this.props.show) {
      const $modal = this.refs.modal
      const { hideUrlModal } = this.props
      window.$($modal)
      .modal({
        detachable: false,
        onHidden: hideUrlModal,
        onApprove: this.handleSubmit
      })
      .modal('show')
    }
  }

  render () {
    const { show } = this.props
    if (!show) return null
    const { url } = this.state
    const disabled = url !== '' ? '' : 'disabled'
    return (
      <div className='ui modal' ref='modal'>
        <div className='header'>Create document from an URL</div>
        <div className='content'>
          <form className='ui form' onSubmit={this.handleSubmit}>
            <div className='field'>
              <label>URL</label>
              <input
                type='url'
                name='url'
                required
                value={url}
                onChange={this.handleChange}
                placeholder='Document url'
              />
            </div>
          </form>
        </div>
        <div className='actions'>
          <div className='ui cancel button'>Cancel</div>
          <div className={`ui primary approve button ${disabled}`}>Submit</div>
        </div>
      </div>
    )
  }

  handleChange (event) {
    this.setState({url: event.target.value})
  }

  handleSubmit () {
    const {push, location} = this.props
    const {url} = this.state
    push({
      pathname: '/document/create',
      query: { origin: encodeURIComponent(url) },
      state: { modal: true, returnTo: location }
    })
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  show: state.urlModal.show
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, routerActions, urlModalActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentUrlModal)
