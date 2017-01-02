import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Dropdown, Label, Icon } from 'semantic-ui-react'

import { actions as documentActions } from 'store/modules/document'

export class DocumentLabels extends React.Component {
  static propTypes = {
    doc: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    labels: PropTypes.object.isRequired,
    updateDocument: PropTypes.func.isRequired
  };

  static defaultProps = {
    editable: false
  };

  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  renderViewMode () {
    const { doc } = this.props
    if (!doc.labels) {
      return null
    }
    const $labels = doc.labels.map((id) => {
      const l = this.resolveLabel(id)
      if (!l) {
        return null
      }
      const color = {color: l.color}
      const key = `label-${doc.id}-${l.id}`
      const to = {pathname: `/labels/${l.id}`}
      return (
        <Label as={Link} key={key} to={to} >
          <Icon name='circle' style={color} />
          {l.label}
        </Label>
      )
    })

    return (
      <Label.Group size='mini'>
        {$labels}
      </Label.Group>
    )
  }

  renderEditMode () {
    const { labels, doc } = this.props
    const value = doc.labels ? doc.labels : []
    const options = labels.items.map((l) => {
      const color = {color: l.color}
      return {
        text: l.label,
        value: l.id,
        color: l.color,
        content: <div><Icon name='circle' style={color} /> {l.label}</div>
      }
    })
    const renderLabel = (label, index, props) => {
      const color = {color: label.color}
      return (
        <Label>
          <Icon name='circle' style={color} />
          {label.text}
        </Label>
      )
    }

    return (
      <Dropdown
        search
        multiple
        selection
        fluid
        options={options}
        placeholder='No label'
        renderLabel={renderLabel}
        defaultValue={value}
        onChange={this.handleChange}
      />
    )
  }

  render () {
    const { editable } = this.props
    return editable ? this.renderEditMode() : this.renderViewMode()
  }

  handleChange (event, {value}) {
    const { updateDocument, doc } = this.props
    const payload = {
      labels: value
    }
    updateDocument(doc, payload)
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
  bindActionCreators(Object.assign({}, documentActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentLabels)
