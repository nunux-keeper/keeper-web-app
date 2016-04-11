import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'

import { actions as documentsActions } from 'redux/modules/documents'

export class DocumentLabels extends React.Component {
  static propTypes = {
    doc: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    labels: PropTypes.object.isRequired
  };

  static defaultProps = {
    editable: false
  };

  componentDidMount () {
    const $el = this.refs.labels
    window.$($el).dropdown({
      transition: 'drop'
    })
  }

  renderViewMode () {
    const { doc } = this.props
    const labels = doc.labels.map((id) => {
      const l = this.resolveLabel(id)
      if (!l) {
        return null
      }
      const color = {color: l.color}
      const key = `label-${doc.id}-${l.id}`
      const to = {pathname: `/label/${l.id}`}
      return (
        <Link key={key} to={to} className='ui label'>
          <i className='circle icon' style={color}></i>
          {l.label}
        </Link>
      )
    })

    return (
      <div className='ui mini labels' ref='labels'>{labels}</div>
    )
  }

  renderEditMode () {
    const { doc, labels } = this.props
    const value = doc.labels.map((l) => l.id)
    const items = labels.items.map((l) => {
      const key = `label-${doc.id}-${l.id}`
      const color = {color: l.color}
      return (
        <div className='item' data-value={l.id} key={key}>
          <i className='circle icon' style={color}></i>
          {l.label}
        </div>
      )
    })

    return (
      <div className='ui fluid multiple search selection dropdown' ref='labels'>
        <input type='hidden' name='country' value={value} />
        <i className='dropdown icon'></i>
        <div className='default text'>No labels</div>
        <div className='menu'>
          {items}
        </div>
      </div>
    )
  }

  render () {
    const { editable } = this.props
    return editable ? this.renderEditMode() : this.renderViewMode()
  }

  resolveLabel (id) {
    const { items: labels } = this.props.labels
    return labels ? labels.find((l) => l.id === id) : null
  }
}

const mapStateToProps = (state) => ({
  labels: state.labels
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, documentsActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentLabels)
