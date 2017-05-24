import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';
import Footer from '../Footer/Footer';

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
                    <OrderListView />
                    <OrderListView />
                    <OrderListView />
            </div>
          </div>
          <Footer />
      </div>
    );
  }
}

export default AccountOrders;
