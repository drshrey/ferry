// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import NotFound from './NotFound/NotFound';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Dashboard from './Dashboard/Dashboard';
import Travel from './Travel/Travel';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/travel" component={Travel} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;