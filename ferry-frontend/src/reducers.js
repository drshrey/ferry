import { combineReducers } from 'redux'
import { ADD_USER_INFORMATION } from './actions'


export default function userInformation(state = [], action) {
  switch (action.type) {
    case ADD_USER_INFORMATION:
      return action.userInfo
    default:
      return state
  }
}