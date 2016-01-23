import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'
import auth from './modules/auth'
import counter from './modules/counter'
import documents from './modules/documents'

export default combineReducers({
  auth,
  documents,
  counter,
  router
})
