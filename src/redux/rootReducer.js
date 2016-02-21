import { combineReducers } from 'redux'
import { routeReducer as routing } from 'react-router-redux'
import auth from './modules/auth'
import device from './modules/device'
import navigation from './modules/navigation'
import notification from './modules/notification'
import label from './modules/label'
import labels from './modules/labels'
import document from './modules/document'
import documents from './modules/documents'

export default combineReducers({
  auth,
  device,
  label,
  labels,
  document,
  documents,
  navigation,
  notification,
  routing
})
