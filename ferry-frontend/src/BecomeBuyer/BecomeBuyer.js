import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import {CardDeck} from 'reactstrap';

import '../account.css';
import './BecomeBuyer.css';

class BecomeBuyer extends Component {
  render() {
    return (
      <div className="BecomeBuyer">
          <div className="main">
              <Header />
              <br/>
             <BigText text="Become a Buyer" />
          </div>
      </div>
    );
  }
}

export default BecomeBuyer;
