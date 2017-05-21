import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import {CardDeck} from 'reactstrap';

import '../account.css';
import './AccountTravel.css';

class AccountTravel extends Component {
  render() {
    return (
      <div className="AccountTravel">
          <div className="main">
              <Header />
              <br/>
              <AccountSidebar highlight="orders" />
             <div className="Content">
                <BigText text="My Traveller Settings" />
            </div>
          </div>
      </div>
    );
  }
}

export default AccountTravel;
