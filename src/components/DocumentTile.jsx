import React, { PropTypes } from 'react'

import GridTile from 'material-ui/lib/grid-list/grid-tile'
import StarBorder from 'material-ui/lib/svg-icons/toggle/star-border'
import IconButton from 'material-ui/lib/icon-button'

export default class DocumentTile extends React.Component {
  static propTypes = {
    value: PropTypes.object.isRequired
  };

  render () {
    const doc = this.props.value
    return (
      <GridTile
        key={doc.id}
        title={doc.title}
        subtitle={<span>by <b>{doc.origin}</b></span>}
        actionIcon={<IconButton><StarBorder color='white'/></IconButton>}>
        <img src='http://placehold.it/320x200' />
      </GridTile>
    )
  }
}

