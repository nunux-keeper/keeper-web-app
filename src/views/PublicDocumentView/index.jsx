import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Dimmer, Loader } from 'semantic-ui-react'

import DocumentContent from 'components/DocumentContent'

import { bindActions } from 'store/helper'

import { routerActions as RouterActions } from 'react-router-redux'

import * as NProgress from 'nprogress'

export class PublicDocumentView extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    document: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.redirectBack = this.redirectBack.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    // if no document found then redirect...
    if (
      !nextProps.document.isFetching &&
      !nextProps.document.isProcessing &&
      !nextProps.document.current
    ) {
      console.debug('No more document. Redirecting...')
      this.redirectBack()
    }
  }

  componentDidUpdate (prevProps) {
    const {isProcessing} = this.props.document
    const {isProcessing: wasProcessing} = prevProps.document
    if (!wasProcessing && isProcessing) {
      NProgress.start()
    } else if (wasProcessing && !isProcessing) {
      NProgress.done()
    }
    document.title = this.title
  }

  redirectBack () {
    const {actions, location} = this.props
    const url = location.pathname
    const to = url.substr(0, url.lastIndexOf('/'))
    actions.router.push(to)
  }

  get originLink () {
    const { current: doc } = this.props.document
    if (doc.origin) {
      return (
        <span className='originLink'>
          Origin: <a href={doc.origin} target='_blank'>{doc.origin}</a>
        </span>
      )
    }
  }

  get modificationDate () {
    const { current: doc } = this.props.document
    if (doc.date) {
      const date = String(doc.date)
      return (
        <span className='modificationDate'>
          Last modification: {date}
        </span>
      )
    }
  }

  get title () {
    const { isFetching, current: doc } = this.props.document
    return isFetching || !doc ? 'Document' : doc.title
  }

  get header () {
    return (
      <h2>{this.title}</h2>
    )
  }

  get document () {
    const { isFetching, isProcessing, current: doc } = this.props.document
    if (doc && !isFetching && !isProcessing) {
      return (
        <div>
          {this.originLink}
          <DocumentContent doc={doc} pub />
          {this.modificationDate}
        </div>
      )
    }
  }

  render () {
    const { isFetching, isProcessing } = this.props.document
    return (
      <div className='view page'>
        {this.header}
        <Dimmer.Dimmable dimmed={isFetching || isProcessing} className='viewContent' >
          <Dimmer active={isFetching || isProcessing} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
          {this.document}
        </Dimmer.Dimmable>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  document: state.document,
  location: state.router.locationBeforeTransitions
})

const mapActionsToProps = (dispatch) => (bindActions({
  router: RouterActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(PublicDocumentView)

