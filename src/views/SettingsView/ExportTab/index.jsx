import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindActions } from 'store/helper'
import ExportsActions from 'store/exports/actions'
import ProfileActions from 'store/profile/actions'
import ExportApi from 'api/export'

import { Icon, Button, Progress, Statistic, Header, Divider, Message, Loader } from 'semantic-ui-react'

export class ExportTab extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    exports: PropTypes.object,
    profile: PropTypes.object
  };

  componentDidMount () {
    const { actions } = this.props
    actions.exports.getExportStatus()
    actions.profile.fetchProfile(true)
  }

  handleScheduleAnExport = () => {
    const { actions } = this.props
    actions.exports.scheduleExport().then(actions.exports.getExportStatus)
  };

  get exportWidget () {
    const {progress} = this.props.exports
    if (progress < 0) {
      return this.renderNoExportAvailable()
    } else if (progress >= 0 && progress < 100) {
      return this.renderExportInProgress()
    } else {
      return this.renderExportAvailable()
    }
  }

  get statistics () {
    const {isProcessing, current, error} = this.props.profile
    if (isProcessing) {
      return (<Loader active inline='centered' />)
    } else if (error) {
      return (
        <Message negative>
          <Message.Header>Unable to get statistics</Message.Header>
          <p>{error.toString()}</p>
        </Message>
      )
    } else {
      const usage = Math.ceil(current.storageUsage / 1048576)
      return (
        <Statistic.Group widths='four' size='small'>
          <Statistic value={current.nbDocuments} label='Documents' />
          <Statistic value={current.nbLabels} label='Labels' />
          <Statistic value={current.nbSharing} label='Sharing' />
          <Statistic value={usage} label='Mo' />
        </Statistic.Group>
        )
    }
  }

  renderNoExportAvailable () {
    const {error} = this.props.exports
    const txt = error ? error.toString() : 'No export available'
    return (
      <Message negative={!!error}>
        <Message.Header>{txt}</Message.Header>
        <p>
          You can schedule an export. Depending the number of document this can take a while.
        </p>
        <p>
          <Button primary onClick={this.handleScheduleAnExport}>
            <Icon name='wait' /> Schedule an export
          </Button>
        </p>
      </Message>
    )
  }

  renderExportInProgress () {
    const {progress, exported, total, error} = this.props.exports

    const txt = error ? error.toString() : `${exported} / ${total}`
    return (
      <Message>
        <Message.Header>
          Export in progress
        </Message.Header>
        <p></p>
        <p>Exporting documents...</p>
        <Progress percent={progress} active={!error} error={!!error} progress indicating >
          { txt }
        </Progress>
      </Message>
    )
  }

  renderExportAvailable () {
    const downloadUrl = ExportApi.getDownloadUrl()
    return (
      <Message positive >
        <Message.Header>
          Export available
        </Message.Header>
        <p>Export ready to download.</p>
        <Button as='a' href={downloadUrl} target='_blank' primary >
          <Icon name='download' /> Download
        </Button>
        <Button secondary onClick={this.handleScheduleAnExport}>
          <Icon name='wait' /> Schedule another export
        </Button>
      </Message>
    )
  }

  render () {
    return (
      <div>
        <Header size='small'>Usage and Export</Header>
        <Divider />
        <p>
          Export all your documents in order to re-import them into another
          Nunux Keeper instance or to simply create a backup.
        </p>
        <p>Here your current usage:</p>
        { this.statistics }
        { this.exportWidget }
      </div>
      )
  }
}

const mapStateToProps = (state) => ({
  exports: state.exports,
  profile: state.profile
})

const mapActionsToProps = (dispatch) => (bindActions({
  exports: ExportsActions,
  profile: ProfileActions
}, dispatch))

export default connect(mapStateToProps, mapActionsToProps)(ExportTab)

