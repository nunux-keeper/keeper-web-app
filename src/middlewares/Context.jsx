import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as labelsActions } from 'store/modules/labels'
import { actions as profileActions } from 'store/modules/profile'
import { actions as documentsActions } from 'store/modules/documents'
import { actions as documentActions } from 'store/modules/document'
import { actions as graveyardActions } from 'store/modules/graveyard'

export function fetchProfile (Component) {
  class ProfileAwareComponent extends React.Component {
    static propTypes = {
      fetchProfile: PropTypes.func.isRequired
    };

    componentDidMount () {
      const { fetchProfile } = this.props
      fetchProfile()
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  return connect(null, profileActions)(ProfileAwareComponent)
}

export function createNewDocument (Component) {
  class NewDocumentAwareComponent extends React.Component {
    static propTypes = {
      location: PropTypes.object.isRequired,
      newDocument: PropTypes.func.isRequired,
      createDocument: PropTypes.func.isRequired
    };

    componentDidMount () {
      const { newDocument, createDocument, location } = this.props
      const template = location.query || {}
      if (typeof template.labels === 'string') {
        template.labels = [template.labels]
      }
      if (template.url) {
        const {url} = template
        template.origin = decodeURIComponent(url)
        delete template.url
        createDocument(template)
      } else {
        newDocument(template)
      }
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  return connect(null, documentActions)(NewDocumentAwareComponent)
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

  return connect(null, documentActions)(DocumentAwareComponent)
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

export function fetchGraveyard (Component) {
  class GraveyardAwareComponent extends React.Component {
    static propTypes = {
      params: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      fetchGhosts: PropTypes.func.isRequired
    };

    componentDidMount () {
      console.debug('GraveyardAwareComponent::componentDidMount')
      const { params, location, fetchGhosts } = this.props
      if (!(location.state && location.state.backFromModal)) {
        fetchGhosts({
          label: params.labelId,
          ... location.query
        })
      }
    }

    componentWillReceiveProps (nextProps) {
      console.debug('GraveyardAwareComponent::componentWillReceiveProps')
      const { params, location, fetchGhosts } = this.props
      if (location.search !== nextProps.location.search) {
        fetchGhosts({
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
    bindActionCreators(Object.assign({}, graveyardActions), dispatch)
  )

  return connect(null, mapDispatchToProps)(GraveyardAwareComponent)
}

