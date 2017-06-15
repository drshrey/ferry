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
import About from './About/About';

import RequireAuth from './require_auth';
import AccountOrders from './AccountOrders/AccountOrders';
import AccountPayment from './AccountPayment/AccountPayment';
import AccountTravel from './AccountTravel/AccountTravel';
import AccountInvite from './AccountInvite/AccountInvite';
import BecomeBuyer from './BecomeBuyer/BecomeBuyer';
import BecomeTraveller from './BecomeTraveller/BecomeTraveller';
import Profile from './Profile/Profile';
import Catalog from './Catalog/Catalog';
import Checkout from './Checkout/Checkout';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/login" component={Login} />
    <Route path="/about" component={About} />
    <Route path="/signup" component={SignUp} />
    {/*<Route path="/dashboard" component={RequireAuth(Dashboard)} />*/}
    <Route path="/travel" component={RequireAuth(Travel)} />
    <Route path="/shop" component={Shop} />
    <Route path="/become-buyer" component={RequireAuth(BecomeBuyer)} />
    <Route path="/become-traveller" component={BecomeTraveller} />
    <Route path="/account" component={RequireAuth(Profile)} />
    <Route path="/catalog" component={Catalog} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/account/orders" component={RequireAuth(AccountOrders)} />
    <Route path="/account/payment" component={RequireAuth(AccountPayment)} />
    <Route path="/account/travel" component={RequireAuth(AccountTravel)} />
    <Route path="/account/invite" component={RequireAuth(AccountInvite)} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;
