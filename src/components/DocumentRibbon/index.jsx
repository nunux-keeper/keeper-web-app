import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Label, Icon } from 'semantic-ui-react'

import './styles.css'

export class DocumentRibbon extends React.Component {
  static propTypes = {
    doc: PropTypes.object.isRequired,
    label: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired
  };

  render () {
    const sharedLabels = this.sharedLabels
    if (sharedLabels.length) {
      const { doc } = this.props
      const label = sharedLabels.find((l) => l.current) || sharedLabels[0]
      const to = {pathname: `/sharing/${label.sharing}/${doc.id}`}
      return (
        <Label as={Link} color='blue' ribbon to={to} className='DocumentRibbon' title='View shared document'>
          <Icon name='share alternate' />
          Shared
        </Label>
        )
    }
    return null
  }

  get sharedLabels () {
    const { labels, label, doc } = this.props
    if (labels.items && doc.labels) {
      return doc.labels.map((l) => labels.items.find((_l) => _l.id === l))
        .filter((l) => l && l.sharing)
        .map((l) => {
          return {
            ...l,
            current: label.current && l.id === label.current.id
          }
        })
    }
    return []
  }
}

const mapStateToProps = (state) => ({
  label: state.label,
  labels: state.labels
})

export default connect(mapStateToProps)(DocumentRibbon)
