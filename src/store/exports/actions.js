import {
  createRequestAction,
  createSuccessAction,
  createFailureAction,
  createProgressAction,
  dispatchAction
} from 'store/helper'

import ExportApi from 'api/export'

// ------------------------------------
// Constants
// ------------------------------------
export const SCHEDULE_EXPORT = 'SCHEDULE_EXPORT'
export const EXPORT_STATUS = 'EXPORT_STATUS'

// ------------------------------------
// Schedule export actions
// ------------------------------------
const scheduleExportRequest = createRequestAction(SCHEDULE_EXPORT)
const scheduleExportFailure = createFailureAction(SCHEDULE_EXPORT)
const scheduleExportSuccess = createSuccessAction(SCHEDULE_EXPORT)

export const scheduleExport = () => {
  return (dispatch, getState) => {
    const {exports} = getState()
    if (exports.isProcessing) {
      console.warn('Unable to schedule an export. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Scheduling and export...')
    dispatch(scheduleExportRequest())
    return ExportApi.schedule()
      .then(
        res => dispatchAction(dispatch, scheduleExportSuccess(res)),
        err => dispatchAction(dispatch, scheduleExportFailure(err))
      )
  }
}

// ------------------------------------
// Get export status
// ------------------------------------
const getExportStatusRequest = createRequestAction(EXPORT_STATUS)
const getExportStatusFailure = createFailureAction(EXPORT_STATUS)
const getExportStatusSuccess = createSuccessAction(EXPORT_STATUS)
const getExportStatusProgress = createProgressAction(EXPORT_STATUS)

export const getExportStatus = () => {
  return (dispatch, getState) => {
    const {exports} = getState()
    if (exports.isProcessing) {
      console.warn('Unable to get export status. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Getting export status...')
    dispatch(getExportStatusRequest())
    return ExportApi.getStatus((data) => {
      dispatch(getExportStatusProgress(data))
    }).then(
      res => dispatchAction(dispatch, getExportStatusSuccess(res)),
      err => dispatchAction(dispatch, getExportStatusFailure(err))
    )
  }
}

const actions = {
  scheduleExport,
  getExportStatus
}

export default actions

