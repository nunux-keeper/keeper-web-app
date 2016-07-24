import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import DocumentLabels from 'components/DocumentLabels'
import DocumentContextMenu from 'components/DocumentContextMenu'

import './styles.scss'

export class DocumentTile extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired
  };

  componentDidMount () {
    const $el = this.refs.doc
    window.$($el).find('.dropdown').dropdown({
      transition: 'drop'
    })
  }

  get contextualMenu () {
    const {value: doc} = this.props
    const menu = doc.ghost ? 'restore,destroy' : 'detail,share,divider,editTitle,divider,delete'
    return (
      <div className='contextual-menu'>
        <div className='ui icon top right pointing dropdown circular button'>
          <i className='ellipsis vertical icon'></i>
          <DocumentContextMenu doc={doc} items={menu} />
        </div>
      </div>
    )
  }

  get shareLink () {
    const {value: doc} = this.props
    if (doc.share) {
      return (
        <div className='ui blue ribbon label'>
          <i className='share alternate icon'></i> Shared
        </div>
      )
    }
  }

  get fromLink () {
    const {value: doc} = this.props
    if (doc.origin) {
      return (
        <span className='meta'>
          from&nbsp;
          <a href={doc.origin} target='_blank' title={doc.origin}>
            {doc.origin}
          </a>
        </span>
      )
    }
  }

  get illustration () {
    const {location, value: doc} = this.props
    let $img = <img src='http://placehold.it/320x200?text=No+illustration' />
    if (doc.attachments.length) {
      const base = window.API_ROOT
      const att = doc.attachments[0]
      $img = <img src={`${base}/document/${doc.id}/files/${att.key}`} />
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
          {this.shareLink}
          {$img}
        </Link>
      )
    }
  }

  get header () {
    const {location, value: doc} = this.props
    if (doc.ghost) {
      return (
        <span className='header' title={doc.title}>
          {doc.title}
        </span>
      )
    } else {
      const state = { modal: true, returnTo: location, title: doc.title }
      return (
        <Link
          to={{ pathname: `${location.pathname}/${doc.id}`, state: state }}
          title={doc.title}
          className='header'>
          {doc.title}
        </Link>
      )
    }
  }

  render () {
    const { value: doc } = this.props
    return (
      <div className='ui card doc' id={`doc-${doc.id}`} ref='doc'>
        <div title={doc.title}>
          {this.illustration}
          {this.contextualMenu}
        </div>
        <div className='content'>
          {this.header}
          {this.fromLink}
          <DocumentLabels doc={doc} editable={false} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  location: state.router.locationBeforeTransitions
})

export default connect(mapStateToProps)(DocumentTile)
