import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions as documentsActions } from 'redux/modules/documents'

export class DocumentLabels extends React.Component {
  static propTypes = {
    doc: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired
  };

  get labels () {
    const { doc } = this.props
    return doc.labels.map((id) => {
      const l = this.resolveLabel(id)
      const color = {backgroundColor: l.color}
      return (
        <a className='ui mini label' style={color} key={`tag-${doc.id}-${l.id}`}>
          <i className='tag icon'></i> {l.label}
        </a>
      )
    })
  }

  render () {
    return (
      <div className='ui mini labels'>
        {this.labels}
      </div>
    )
  }

  resolveLabel (id) {
    const { items: labels } = this.props.labels
    const result = labels ? labels.find((l) => l.id === id) : null
    return result || {label: 'n/a', color: '#f00', id: id}
  }
}

const mapStateToProps = (state) => ({
  labels: state.labels
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, documentsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentLabels)
