import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'
import counter from './modules/counter'
import documents from './modules/documents'

export default combineReducers({
  documents,
  counter,
  router
})
