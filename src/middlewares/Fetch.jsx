import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as labelActions } from 'redux/modules/label'
import { actions as documentsActions } from 'redux/modules/documents'

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
      console.debug('Mount documents aware component...')
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
      console.debug('Updating documents aware component...')
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

export function fetchLabelAndDocument (Component) {
  return fetchDocument(fetchLabel(Component))
}

export function fetchLabelAndDocuments (Component) {
  return fetchDocuments(fetchLabel(Component))
}

