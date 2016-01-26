import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as documentActions } from '../../redux/modules/document'
import { actions as titleActions } from '../../redux/modules/title'

import Card from 'material-ui/lib/card/card'
import CardActions from 'material-ui/lib/card/card-actions'
import CardTitle from 'material-ui/lib/card/card-title'
import CardText from 'material-ui/lib/card/card-text'
import IconButton from 'material-ui/lib/icon-button'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import Divider from 'material-ui/lib/divider'

import FontIcon from 'material-ui/lib/font-icon'

export class DocumentView extends React.Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    fetchDocument: PropTypes.func.isRequired,
    updateTitle: PropTypes.func.isRequired
  };

  componentDidMount () {
    const { fetchDocument } = this.props
    // updateTitle('Document')
    fetchDocument()
  }

  renderTitle () {
    const doc = this.props.document.value
    return (
      <div>
        {doc.title}
        <a href={doc.origin} target='_blank'>
          <IconButton
            iconClassName='material-icons'
            tooltip='Go to origin'>
            link
          </IconButton>
        </a>
      </div>
    )
  }

  render () {
    const doc = this.props.document.value
    const iconButtonElement = <IconButton
      iconClassName='material-icons'
      tooltip='More...' tooltipPosition='top-center'>
      more_vert
    </IconButton>

    if (doc) {
      return (
        <Card>
          <CardTitle title={this.renderTitle()}/>
          <CardText>
            {doc.content}
            <br/>
            <span>Last modification: {doc.date.toString()}</span>
          </CardText>
          <CardActions>
            <IconButton
              iconClassName='material-icons'
              tooltip='Edit document' tooltipPosition='top-center'>
              edit
            </IconButton>
            <IconButton
              iconClassName='material-icons'
              tooltip='Share document' tooltipPosition='top-center'>
              share
            </IconButton>
            <IconButton
              iconClassName='material-icons'
              tooltip='Edit labels' tooltipPosition='top-center'>
              label
            </IconButton>
            <IconMenu iconButtonElement={iconButtonElement}>
              <MenuItem primaryText='Upload file' leftIcon={<FontIcon className='material-icons'>file_upload</FontIcon>}/>
              <Divider />
              <MenuItem primaryText='Remove' leftIcon={<FontIcon className='material-icons'>delete</FontIcon>}/>
            </IconMenu>
          </CardActions>
        </Card>
      )
    } else {
      return (
        <p>LOADING...</p>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  document: state.document
})

const mapDispatchToProps = (dispatch) => (
  bindActionCreators(Object.assign({}, titleActions, documentActions), dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(DocumentView)

