import { combineReducers } from 'redux'
import { routeReducer as routing } from 'react-router-redux'
import auth from './modules/auth'
import device from './modules/device'
import title from './modules/title'
import navigation from './modules/navigation'
import labels from './modules/labels'
import documents from './modules/documents'
import document from './modules/document'

export default combineReducers({
  auth,
  device,
  labels,
  documents,
  document,
  title,
  navigation,
  routing
})
