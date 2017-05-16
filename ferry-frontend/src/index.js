import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import Routes from './routes.js'

import './index.css';

import userInformation from './reducers';


// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(browserHistory)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    userInformation,
    router: routerReducer
  }),
  applyMiddleware(middleware)
)


ReactDOM.render(
    <Provider store={store}>
        <Routes history={browserHistory} />
    </Provider>, document.getElementById('root')
);