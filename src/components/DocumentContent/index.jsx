import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as documentActions } from 'store/modules/document'

import styles from './styles.scss'

export class DocumentContent extends React.Component {
  static propTypes = {
    doc: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    updateDocument: PropTypes.func.isRequired
  };

  static defaultProps = {
    editable: false
  };

  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount () {
    const $el = this.refs.content
    const { editable } = this.props
    if (editable) {
      window.AlloyEditor.editable($el)
    }
  }

  onChange (value, text, $selectedItem) {
    const { updateDocument, doc } = this.props
    const payload = {
      labels: value.split(',')
    }
    updateDocument(doc, payload)
  }

  render () {
    const { doc } = this.props
    return (
      <div
        ref='content'
        className={styles.content}
        dangerouslySetInnerHTML={{__html: doc.content}}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, documentActions), dispatch)
)

export default connect(null, mapDispatchToProps)(DocumentContent)
