import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as labelsActions } from 'redux/modules/labels'
import { actions as documentsActions } from 'redux/modules/documents'

export function createDocument (Component) {
  class NewDocumentAwareComponent extends React.Component {
    static propTypes = {
      location: PropTypes.object.isRequired,
      newDocument: PropTypes.func.isRequired,
      createDocument: PropTypes.func.isRequired
    };

    componentDidMount () {
      const { newDocument, createDocument, location } = this.props
      if (location.query && location.query.url) {
        createDocument(location.query)
      } else {
        newDocument(location.query)
      }
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  return connect(null, documentsActions)(NewDocumentAwareComponent)
}

export function fetchDocument (Component) {
  class DocumentAwareComponent extends React.Component {
    static propTypes = {
      params: PropTypes.object.isRequired,
      fetchDocument: PropTypes.func.isRequired
    };

    componentDidMount () {
      const { fetchDocument } = this.props
      const { docId } = this.props.params
      fetchDocument(docId)
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  return connect(null, documentsActions)(DocumentAwareComponent)
}

export function fetchDocuments (Component) {
  class DocumentsAwareComponent extends React.Component {
    static propTypes = {
      params: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      fetchDocuments: PropTypes.func.isRequired,
      discardLabel: PropTypes.func.isRequired
    };

    componentDidMount () {
      console.debug('DocumentsAwareComponent::componentDidMount')
      const { params, location, fetchDocuments, discardLabel } = this.props
      if (!(location.state && location.state.backFromModal)) {
        fetchDocuments({
          label: params.labelId,
          ... location.query
        })
        if (!params.labelId) {
          discardLabel()
        }
      }
    }

    componentWillReceiveProps (nextProps) {
      console.debug('DocumentsAwareComponent::componentWillReceiveProps')
      const { params, location, fetchDocuments } = this.props
      if (params.labelId !== nextProps.params.labelId) {
        fetchDocuments({
          label: nextProps.params.labelId,
          ... nextProps.location.query
        })
      } else if (location.search !== nextProps.location.search) {
        fetchDocuments({
          label: params.labelId,
          ... nextProps.location.query
        })
      }
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  const mapDispatchToProps = (dispatch) => (
    bindActionCreators(Object.assign({}, documentsActions, labelsActions), dispatch)
  )

  return connect(null, mapDispatchToProps)(DocumentsAwareComponent)
}

export function fetchLabel (Component) {
  class LabelAwareComponent extends React.Component {
    static propTypes = {
      params: PropTypes.object.isRequired,
      fetchLabel: PropTypes.func.isRequired
    };

    componentDidMount () {
      const { fetchLabel } = this.props
      const { labelId } = this.props.params
      fetchLabel(labelId)
    }

    componentWillReceiveProps (nextProps) {
      const { params, fetchLabel } = this.props
      if (params.labelId !== nextProps.params.labelId) {
        fetchLabel(nextProps.params.labelId)
      }
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  return connect(null, labelsActions)(LabelAwareComponent)
}

export function fetchLabelAndDocument (Component) {
  return fetchDocument(fetchLabel(Component))
}

export function fetchLabelAndDocuments (Component) {
  return fetchDocuments(fetchLabel(Component))
}

