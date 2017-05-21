import React, { Component } from 'react';
import { Link } from 'react-router';

import BigText from '../BigText/BigText';
import Header from '../Header/Header';
import AccountSidebar from '../AccountSidebar/AccountSidebar';

import OrderListView from '../OrderListView/OrderListView';
import {CardDeck} from 'reactstrap';

import '../account.css';
import './AccountInvite.css';

class AccountInvite extends Component {
  render() {
    return (
      <div className="AccountInvite">
          <div className="main">
              <Header />
              <br/>
              <AccountSidebar highlight="invite" />
             <div className="Content">
                <BigText text="Invite" />
            </div>
          </div>
      </div>
    );
  }
}

export default AccountInvite;
