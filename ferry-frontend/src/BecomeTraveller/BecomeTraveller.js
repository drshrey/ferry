import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import {CardDeck} from 'reactstrap';

import '../account.css';
import './BecomeTraveller.css';

class BecomeTraveller extends Component {
  render() {
    return (
      <div className="BecomeTraveller">
          <div className="main">
              <Header />
              <br/>
              <BigText text="Become a Traveller" />
            </div>
      </div>
    );
  }
}

export default BecomeTraveller;
