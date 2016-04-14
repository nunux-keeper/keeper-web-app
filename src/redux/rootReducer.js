import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import auth from './modules/auth'
import device from './modules/device'
import notification from './modules/notification'
import label from './modules/label'
import labels from './modules/labels'
import documents from './modules/documents'

export default combineReducers({
  router,
  auth,
  device,
  label,
  labels,
  documents,
  notification
})
