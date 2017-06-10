// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import NotFound from './NotFound/NotFound';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Dashboard from './Dashboard/Dashboard';
import Travel from './Travel/Travel';
import Shop from './Shop/Shop';

import RequireAuth from './require_auth';
import AccountOrders from './AccountOrders/AccountOrders';
import AccountPayment from './AccountPayment/AccountPayment';
import AccountTravel from './AccountTravel/AccountTravel';
import AccountInvite from './AccountInvite/AccountInvite';
import BecomeBuyer from './BecomeBuyer/BecomeBuyer';
import BecomeTraveller from './BecomeTraveller/BecomeTraveller';
import Profile from './Profile/Profile';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
    <Route path="/dashboard" component={RequireAuth(Dashboard)} />
    <Route path="/travel" component={RequireAuth(Travel)} />
    <Route path="/shop" component={Shop} />
    <Route path="/become-buyer" component={RequireAuth(BecomeBuyer)} />
    <Route path="/become-traveller" component={BecomeTraveller} />
    <Route path="/account" component={RequireAuth(Profile)} />
    <Route path="/account/orders" component={RequireAuth(AccountOrders)} />
    <Route path="/account/payment" component={RequireAuth(AccountPayment)} />
    <Route path="/account/travel" component={RequireAuth(AccountTravel)} />
    <Route path="/account/invite" component={RequireAuth(AccountInvite)} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;
