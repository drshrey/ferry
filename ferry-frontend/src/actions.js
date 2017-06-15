/*
 * action types
 */

export const ADD_USER_INFORMATION = 'ADD_USER_INFORMATION'
export const LOGOUT = 'LOGOUT'
export const ADD_TRIPS = 'ADD_TRIPS'
export const ADD_CART = 'ADD_CART'
export const SET_CART_FILLED = 'SET_CART_FILLED'
export const SET_MAX_FILLED = 'SET_MAX_FILLED'

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

export function addTrips(trips){
  return { type: ADD_TRIPS, trips }
}

export function addCart(cart){
  return { type: ADD_CART, cart }
}

export function setCartFilled(cartFilled){
  return { type: SET_CART_FILLED, cartFilled }
}

export function setMaxFilled(maxFilled){
  return { type: SET_MAX_FILLED, maxFilled }
}