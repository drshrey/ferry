import { ADD_USER_INFORMATION, LOGOUT } from './actions'


export default function userInformation(state = [], action) {
  switch (action.type) {
    case ADD_USER_INFORMATION:
      return action.userInfo
    case LOGOUT:      
      return {}
    default:
      return state
  }
}