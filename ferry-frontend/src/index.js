import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { ADD_USER_INFORMATION } from './actions';
import Routes from './routes.js'
import thunk from 'redux-thunk';

import './index.css';

import { userInformation, tripsInformation, cartInformation }  from './reducers';


// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(browserHistory, thunk)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    userInformation,
    tripsInformation,
    cartInformation,
    router: routerReducer
  }),
  applyMiddleware(middleware)
)

const user = JSON.parse(localStorage.getItem('user'))
console.log(user)
if (user){
  store.dispatch({ type: ADD_USER_INFORMATION, userInfo: user })
}


ReactDOM.render(
    <Provider store={store}>
        <Routes history={browserHistory} />
    </Provider>, document.getElementById('root')
);