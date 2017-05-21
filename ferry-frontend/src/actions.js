/*
 * action types
 */

export const ADD_USER_INFORMATION = 'ADD_USER_INFORMATION'
export const LOGOUT = 'LOGOUT'

/*
 * action creators
 */

export function addUserInformation(userInfo) {
  localStorage.setItem('user', JSON.stringify(userInfo))
  return { type: ADD_USER_INFORMATION, userInfo }
}

export function logout(){
  localStorage.setItem('user', null)  
  return { type: LOGOUT }
}