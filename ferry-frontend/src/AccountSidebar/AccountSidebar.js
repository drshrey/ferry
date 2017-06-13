import React, { Component } from 'react';
import { Link } from 'react-router'; 
import SmallLink from '../SmallLink/SmallLink';
import { Nav, NavItem, NavLink } from 'reactstrap';

import classNames from 'classnames';

import 'bootstrap/dist/css/bootstrap.css';

import '../BigText/BigText.css';
import './AccountSidebar.css';

class AccountSidebar extends Component {
  constructor(props){
      super(props)
  }

  render() {
    console.log(this.state)
    let profileClass = classNames({ 'profile-sidebar-link': window.location.pathname == '/account'});
    let ordersClass = classNames({'profile-sidebar-link': window.location.pathname == '/account/orders'});
    let paymentClass = classNames({'profile-sidebar-link': window.location.pathname == '/account/payment'});
    let travelClass = classNames({'profile-sidebar-link': window.location.pathname == '/account/travel'});
    let inviteClass = classNames({'profile-sidebar-link': window.location.pathname == '/account/invite'});

    return (
      <div className="AccountSidebar">
        <Nav vertical>
          <NavItem>
            <SmallLink className={profileClass} text="Account" href="/account" />
          </NavItem>
          <br/>
          <NavItem> 
            <SmallLink className={ordersClass} text="Orders & Returns" href="/account/orders" />
          </NavItem>
          <br/>
          <NavItem>
            <SmallLink className={travelClass} text="Traveller Info" href="/account/travel" />
          </NavItem>
        </Nav>          
      </div>
    );
  }
}

export default AccountSidebar;
