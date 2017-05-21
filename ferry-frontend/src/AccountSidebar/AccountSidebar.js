import React, { Component } from 'react';
import { Link } from 'react-router'; 
import SmallLink from '../SmallLink/SmallLink';
import { Nav, NavItem, NavLink } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';

import '../BigText/BigText.css';
import './AccountSidebar.css';

class AccountSidebar extends Component {
  constructor(props){
      super(props)
  }

  render() {
    
    return (
      <div className="AccountSidebar">
        <Nav vertical>
          <NavItem>
            <SmallLink className="account-sidebar-link" text="Account" href="/account" />
          </NavItem>
          <NavItem>
            <SmallLink className="orders-sidebar-link" text="Orders & Returns" href="/account/orders" />
          </NavItem>
          <NavItem>
            <SmallLink className="payment-sidebar-link" text="Payment Settings" href="/account/payment" />
          </NavItem>
          <NavItem>
            <SmallLink className="travel-sidebar-link" text="Traveller Settings" href="/account/travel" />
          </NavItem>
          <NavItem>
              <SmallLink className="invite-sidebar-link" text="Invite" href="/account/invite" />
          </NavItem>
        </Nav>          
      </div>
    );
  }
}

export default AccountSidebar;
