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
    return (
      <div className='ui icon top right pointing dropdown circular button'>
        <i className='ellipsis vertical icon'></i>
        <DocumentContextMenu doc={doc} items='detail,editTitle,share,delete' />
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

  render () {
    const { location } = this.props
    const doc = this.props.value
    const state = { modal: true, returnTo: location, title: doc.title }
    return (
      <div className='ui card doc' id={`doc-${doc.id}`} ref='doc'>
        <div title={doc.title}>
          <Link to={{ pathname: `${location.pathname}/${doc.id}`, state: state }} className='ui fluid image'>
            {this.shareLink}
            <img src='http://placehold.it/320x200' />
          </Link>
          <div className='contextual-menu'>{this.contextualMenu}</div>
        </div>
        <div className='content'>
          <Link
            to={{ pathname: `${location.pathname}/${doc.id}`, state: state }}
            title={doc.title}
            className='header'>
            {doc.title}
          </Link>
          <span className='meta'>
            from&nbsp;
            <a href={doc.origin} target='_blank' title={doc.origin}>
              {doc.origin}
            </a>
          </span>
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
