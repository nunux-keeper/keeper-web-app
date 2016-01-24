import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'
import auth from './modules/auth'
import title from './modules/title'
import navigation from './modules/navigation'
import documents from './modules/documents'

export default combineReducers({
  auth,
  documents,
  title,
  navigation,
  router
})
