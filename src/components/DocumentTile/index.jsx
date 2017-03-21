import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { Card, Button, Dropdown } from 'semantic-ui-react'

import DocumentRibbon from 'components/DocumentRibbon'
import DocumentLabels from 'components/DocumentLabels'
import DocumentContextMenu from 'components/DocumentContextMenu'

import './styles.css'

const API_ROOT = process.env.REACT_APP_API_ROOT

export default class DocumentTile extends React.Component {
  static propTypes = {
    base: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    sharing: PropTypes.string,
    menu: PropTypes.string,
    pub: PropTypes.bool.isRequired
  };

  get contextualMenu () {
    const {value: doc, pub} = this.props
    if (pub) {
      return null
    }
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

  get illustrationUrl () {
    const {value: doc, sharing, pub} = this.props
    if (doc.attachments.length) {
      const att = doc.attachments[0]
      if (sharing) {
        const type = pub ? 'public' : 'sharing'
        return `${API_ROOT}/${type}/${sharing}/${doc.id}/files/${att.key}?size=320x200`
      } else {
        return `${API_ROOT}/documents/${doc.id}/files/${att.key}?size=320x200`
      }
    }
    return null
  }

  get illustration () {
    const {base, value: doc} = this.props
    let $img = <span>No illustration</span>
    if (doc.attachments.length) {
      $img = <img src={this.illustrationUrl} alt='illustration' onError={(e) => e.target.classList.add('broken')}/>
    }
    if (doc.ghost) {
      return (
        <div className='ui fluid image'>
          {$img}
        </div>
      )
    } else {
      const state = { modal: true, returnTo: base, title: doc.title }
      const pathname = base.pathname.replace(/\/$/, '') + '/' + doc.id
      return (
        <Link to={{ pathname, state }} className='ui fluid image'>
          {$img}
        </Link>
      )
    }
  }

  get header () {
    const {base, value: doc} = this.props
    if (doc.ghost) {
      return (
        <Card.Header as='span' title={doc.title}>
          {doc.title}
        </Card.Header>
      )
    } else {
      const state = { modal: true, returnTo: base, title: doc.title }
      return (
        <Card.Header as={Link} title={doc.title}
          to={{ pathname: `${base.pathname}/${doc.id}`, state: state }}>
          {doc.title}
        </Card.Header>
      )
    }
  }

  get extra () {
    const {value: doc} = this.props
    const editable = !!doc.isEditingLabels
    if (editable || (doc.labels && doc.labels.length > 0)) {
      return (
        <Card.Content extra>
          <DocumentLabels doc={doc} editable={editable} />
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

