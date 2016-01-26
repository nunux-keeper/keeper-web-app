import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'
import auth from './modules/auth'
import device from './modules/device'
import title from './modules/title'
import navigation from './modules/navigation'
import documents from './modules/documents'
import document from './modules/document'

export default combineReducers({
  auth,
  device,
  documents,
  document,
  title,
  navigation,
  router
})
