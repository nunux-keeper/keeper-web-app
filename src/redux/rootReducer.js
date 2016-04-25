import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import auth from './modules/auth'
import apps from './modules/apps'
import device from './modules/device'
import notification from './modules/notification'
import profile from './modules/profile'
import labels from './modules/labels'
import documents from './modules/documents'
import titleModal from './modules/titleModal'
import urlModal from './modules/urlModal'

export default combineReducers({
  router,
  auth,
  apps,
  device,
  labels,
  documents,
  notification,
  profile,
  titleModal,
  urlModal
})
