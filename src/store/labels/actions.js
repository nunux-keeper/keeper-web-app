import {
  createRequestAction,
  createSuccessAction,
  createFailureAction,
  dispatchAction
} from 'store/helper'

import LabelApi from 'api/label'

// --------------------------------------
// Constants
// --------------------------------------
export const FETCH_LABELS = 'FETCH_LABELS'

// --------------------------------------
// Fetch labels actions
// --------------------------------------
const fetchLabelsRequest = createRequestAction(FETCH_LABELS)
const fetchLabelsFailure = createFailureAction(FETCH_LABELS)
const fetchLabelsSuccess = createSuccessAction(FETCH_LABELS)

export const fetchLabels = () => {
  return (dispatch, getState) => {
    const { labels } = getState()
    if (labels.isProcessing) {
      console.warn('Unable to fetch labels. An action is pending...')
      return Promise.resolve(null)
    }
    console.debug('Fetching labels...')
    dispatch(fetchLabelsRequest())
    return LabelApi.all()
      .then(
        res => dispatchAction(dispatch, fetchLabelsSuccess(res)),
        err => dispatchAction(dispatch, fetchLabelsFailure(err))
      )
  }
}

const actions = {
  fetchLabels
}

export default actions

