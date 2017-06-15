import { ADD_USER_INFORMATION, LOGOUT, ADD_TRIPS, ADD_CART, SET_CART_FILLED, SET_MAX_FILLED } from './actions'


export function userInformation(state = {}, action) {
  switch (action.type) {
    case ADD_USER_INFORMATION:
      return action.userInfo
    case LOGOUT:      
      return {}
    default:
      return state
  }
}


const initialTripsState = {
  trips: []
}
export function tripsInformation(state = initialTripsState, action) {
  switch(action.type){
    case ADD_TRIPS:
      return Object.assign({}, state, {
          trips: action.trips
      })      
    default:
      return state
  }
}

const initialCartState = {
  cart: {},
  maxFilled: 100,
  cartFilled: 0
}
export function cartInformation(state = initialCartState, action) {
  switch(action.type){
    case ADD_CART:
      return Object.assign({}, state, {
          cart: action.cart
      })      
    case SET_MAX_FILLED:
      return Object.assign({}, state, {
          maxFilled: action.maxFilled
      })  
    case SET_CART_FILLED:
      return Object.assign({}, state, {
          cartFilled: action.cartFilled
      })                    
    default:
      return state
  }
}

