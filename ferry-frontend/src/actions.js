/*
 * action types
 */

export const ADD_USER_INFORMATION = 'ADD_USER_INFORMATION'

/*
 * action creators
 */

export function addUserInformation(userInfo) {
  return { type: ADD_USER_INFORMATION, userInfo }
}
