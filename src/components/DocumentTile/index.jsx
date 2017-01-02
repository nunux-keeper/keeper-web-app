import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Card, Button, Dropdown } from 'semantic-ui-react'

import DocumentRibbon from 'components/DocumentRibbon'
import DocumentLabels from 'components/DocumentLabels'
import DocumentContextMenu from 'components/DocumentContextMenu'

import './styles.css'

const API_ROOT = process.env.REACT_APP_API_ROOT

export class DocumentTile extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    menu: PropTypes.string
  };

  get contextualMenu () {
    const {value: doc} = this.props
    const menu = doc.ghost ? 'restore,destroy' : this.props.menu
    const trigger = <Button circular icon='ellipsis vertical' />
    return (
      <div className='contextual-menu'>
        <Dropdown trigger={trigger} pointing='top right' className='hack'>
          <DocumentContextMenu doc={doc} items={menu} />
        </Dropdown>
      </div>
    )
  }

  get meta () {
    const {value: doc} = this.props
    if (doc.origin) {
      return (
        <Card.Meta as='span'>
          from&nbsp;
          <a href={doc.origin} target='_blank' title={doc.origin}>
            {doc.origin}
          </a>
        </Card.Meta>
      )
    }
  }

  get illustration () {
    const {location, value: doc} = this.props
    let $img = <span>No illustration</span>
    if (doc.attachments.length) {
      const base = API_ROOT
      const att = doc.attachments[0]
      const src = `${base}/documents/${doc.id}/files/${att.key}?size=320x200`
      $img = <img src={src} alt='illustration' onError={(e) => e.target.classList.add('broken')}/>
    }
    if (doc.ghost) {
      return (
        <div className='ui fluid image'>
          {$img}
        </div>
      )
    } else {
      const state = { modal: true, returnTo: location, title: doc.title }
      return (
        <Link to={{ pathname: `${location.pathname}/${doc.id}`, state: state }} className='ui fluid image'>
          {$img}
        </Link>
      )
    }
  }

  get header () {
    const {location, value: doc} = this.props
    if (doc.ghost) {
      return (
        <Card.Header as='span' title={doc.title}>
          {doc.title}
        </Card.Header>
      )
    } else {
      const state = { modal: true, returnTo: location, title: doc.title }
      return (
        <Card.Header as={Link} title={doc.title}
          to={{ pathname: `${location.pathname}/${doc.id}`, state: state }}>
          {doc.title}
        </Card.Header>
      )
    }
  }

  get extra () {
    const {value: doc} = this.props
    if (doc.labels && doc.labels.length > 0) {
      return (
        <Card.Content extra>
          <DocumentLabels doc={doc} editable={false} />
        </Card.Content>
      )
    }
  }

  render () {
    const { value: doc } = this.props
    return (
      <Card className='DocumentTile' id={`doc-${doc.id}`}>
        <div title={doc.title} className='illustration'>
          {this.illustration}
          <DocumentRibbon doc={doc} />
          {this.contextualMenu}
        </div>
        <Card.Content>
          {this.header}
          {this.meta}
        </Card.Content>
        {this.extra}
      </Card>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

export default connect(mapStateToProps)(DocumentTile)
