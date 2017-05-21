import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import {CardDeck} from 'reactstrap';

import '../account.css';
import './AccountOrders.css';

class AccountOrders extends Component {
  render() {
    return (
      <div className="AccountOrders">
          <div className="main">
              <Header />
              <br/>
              <AccountSidebar highlight="orders" />
             <div className="Content">
                <BigText text="Orders & Returns" />
                <CardDeck>
                    <OrderListView />
                    <OrderListView />
                    <OrderListView />
                </CardDeck>
            </div>
          </div>
      </div>
    );
  }
}

export default AccountOrders;
