import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'
import { actions as UrlModalActions } from 'store/modules/urlModal'

export class DocumentUrlModal extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.onChangeUrl = this.onChangeUrl.bind(this)
    this.onChangeCreateMethod = this.onChangeCreateMethod.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      url: '',
      method: 'default'
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.show && this.props.show) {
      const $modal = this.refs.modal
      const { actions } = this.props
      window.$($modal)
      .modal({
        detachable: false,
        onHidden: actions.urlModal.hideUrlModal,
        onApprove: this.handleSubmit
      })
      .modal('show')
      const $form = this.refs.form
      window.$($form)
      .form({
        on: 'blur',
        fields: {
          url: ['url', 'empty']
        }
      })
    }
  }

  get isValid () {
    const $form = this.refs.form
    return $form && window.$($form).form('is valid')
  }

  render () {
    const { show } = this.props
    if (!show) return null
    const { url } = this.state
    const disabled = this.isValid ? '' : 'disabled'
    return (
      <div className='ui modal' ref='modal'>
        <div className='header'>Create document from an URL</div>
        <div className='content'>
          <form className='ui form' onSubmit={this.handleSubmit} ref='form'>
            <div className='field'>
              <label>URL</label>
              <input
                type='url'
                name='url'
                required
                value={url}
                onChange={this.onChangeUrl}
                placeholder='Document url'
              />
            </div>
            <div className='inline fields'>
              <div className='field'>
                <div className='ui radio checkbox'>
                  <input
                    type='radio'
                    name='method'
                    value='default'
                    onChange={this.onChangeCreateMethod}
                    defaultChecked
                  />
                  <label>Extract content</label>
                </div>
              </div>
              <div className='field'>
                <div className='ui radio checkbox'>
                  <input
                    type='radio'
                    name='method'
                    value='bookmark'
                    onChange={this.onChangeCreateMethod}
                  />
                  <label>Bookmark the URL</label>
                </div>
              </div>
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

  onChangeUrl (event) {
    this.setState({url: event.target.value})
  }

  onChangeCreateMethod (event) {
    this.setState({method: event.target.value})
  }

  handleSubmit () {
    if (this.isValid) {
      const {actions} = this.props
      const {url, method} = this.state
      const u = encodeURIComponent(method !== 'default' ? `${method}+${url}` : url)
      actions.router.push({
        pathname: '/document/create',
        query: { url: u }
        // FIXME When modal documents view is crushed by the create view
        // state: { modal: true, returnTo: location }
      })
    }
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions,
  show: state.urlModal.show
})

const mapActionsToProps = (dispatch) => (bindActions({
  router: RouterActions,
  urlModal: UrlModalActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(DocumentUrlModal)
