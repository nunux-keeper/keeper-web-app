import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as labelActions } from 'store/modules/label'
import { actions as sharingActions } from 'store/modules/sharing'
import { actions as documentsActions } from 'store/modules/documents'
import { actions as documentActions } from 'store/modules/document'
import { actions as graveyardActions } from 'store/modules/graveyard'

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
          ...location.query
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
          ...nextProps.location.query
        })
      } else if (location.search !== nextProps.location.search) {
        fetchDocuments({
          label: params.labelId,
          ...nextProps.location.query
        })
      }
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  const mapDispatchToProps = (dispatch) => (
    bindActionCreators(Object.assign({}, documentsActions, labelActions), dispatch)
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

  return connect(null, labelActions)(LabelAwareComponent)
}

export function fetchLabelAndSharing (Component) {
  class SharingAwareComponent extends React.Component {
    static propTypes = {
      params: PropTypes.object.isRequired,
      fetchSharing: PropTypes.func.isRequired,
      fetchLabel: PropTypes.func.isRequired
    };

    componentDidMount () {
      const { fetchLabel, fetchSharing } = this.props
      const { labelId } = this.props.params
      fetchLabel(labelId)
        .then((label) => {
          if (label.sharing) {
            fetchSharing()
          }
        })
    }

    componentWillReceiveProps (nextProps) {
      const { params, fetchLabel, fetchSharing } = this.props
      if (params.labelId !== nextProps.params.labelId) {
        fetchLabel(nextProps.params.labelId)
          .then((label) => {
            if (label.sharing) {
              fetchSharing()
            }
          })
      }
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  const mapDispatchToProps = (dispatch) => (
    bindActionCreators(Object.assign({}, sharingActions, labelActions), dispatch)
  )
  return connect(null, mapDispatchToProps)(SharingAwareComponent)
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
          ...location.query
        })
      }
    }

    componentWillReceiveProps (nextProps) {
      console.debug('GraveyardAwareComponent::componentWillReceiveProps')
      const { params, location, fetchGhosts } = this.props
      if (location.search !== nextProps.location.search) {
        fetchGhosts({
          label: params.labelId,
          ...nextProps.location.query
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

export function fetchSharing (Component) {
  class SharingListAwareComponent extends React.Component {
    static propTypes = {
      fetchSharingList: PropTypes.func.isRequired
    };

    componentDidMount () {
      const { fetchSharingList } = this.props
      fetchSharingList()
    }

    render () {
      return (<Component {...this.props}/>)
    }
  }

  return connect(null, sharingActions)(SharingListAwareComponent)
}

